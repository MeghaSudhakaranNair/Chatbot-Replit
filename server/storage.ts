import {
  type User,
  type InsertUser,
  type Message,
  type InsertMessage,
  users,
  messages,
} from "@shared/schema";
import { v4 as randomUUID } from "uuid";
import { drizzle } from "drizzle-orm/node-postgres"; // <-- CRITICAL FIX
import { Pool } from "pg"; // <-- CRITICAL FIX
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Removed: neonConfig.webSocketConstructor = ws;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Message[];

  constructor() {
    this.users = new Map();
    this.messages = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error("FATAL: DATABASE_URL is not set");
    }

    try {
      // 1. Create a Pool instance using the standard 'pg' library
      const pool = new Pool({
        connectionString: dbUrl,
      });

      // 2. Initialize Drizzle with the standard Node-Postgres Pool
      this.db = drizzle(pool);

      // Run init for connection check
      this.init().catch((err) => {
        console.error(
          "Failed to initialize database connection or ensure tables:",
          err.message
        );
        // Do not throw here, as constructor can't be async, but the async init handles the error logging.
      });
    } catch (error) {
      console.error("Failed to initialize database connection:", error);
      throw error;
    }
  }

  // New init method to ensure the connection works
  private async init() {
    console.log("Attempting to connect and ensure schema...");

    // Execute a simple query to confirm the pool can connect to the database
    await this.db.execute(sql`SELECT 1;`);

    console.log("Drizzle connected successfully.");
    console.log(
      "Tables (users, messages) assumed to be created via migration script."
    );
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // NOTE: This stores passwords in plaintext. Before enabling authentication,
      // implement password hashing (e.g., bcrypt) in the authentication layer.
      const result = await this.db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    try {
      // Add ID and timestamp as they are often handled by the database in a simple setup,
      // but Drizzle often requires them if they are not DB-generated defaults.
      const messageWithDefaults: InsertMessage = {
        ...insertMessage,
        id: randomUUID(), // Ensure ID is present
        timestamp: new Date(), // Ensure timestamp is present
      };
      console.log("message", messageWithDefaults, "insert", insertMessage);

      const result = await this.db
        .insert(messages)
        .values(messageWithDefaults)
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      return await this.db.select().from(messages).orderBy(messages.timestamp);
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  async clearMessages(): Promise<void> {
    try {
      // This is the Drizzle way to execute a delete statement without a WHERE clause
      await this.db.delete(messages);
    } catch (error) {
      console.error("Error clearing messages:", error);
      throw error;
    }
  }
}

// NOTE: We wrap the storage initialization in a block so that it throws the error
// if initialization fails, which is necessary for the server to halt.
let storageInstance: IStorage;
try {
  storageInstance = new DbStorage();
} catch (e) {
  console.error(
    "FATAL: Database storage failed to load. Check environment variables and PostgreSQL service."
  );
  // We don't throw the error here in the exported code, because the inner init() handles throwing if the connection fails async.
}

export const storage = storageInstance!;
