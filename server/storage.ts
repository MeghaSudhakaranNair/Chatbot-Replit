import { type User, type InsertUser, type Message, type InsertMessage, users, messages } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

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
      (user) => user.username === username,
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
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    try {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      this.db = drizzle({ client: pool });
    } catch (error) {
      console.error("Failed to initialize database connection:", error);
      throw error;
    }
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
      const result = await this.db.select().from(users).where(eq(users.username, username));
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
      const result = await this.db.insert(messages).values(insertMessage).returning();
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
      await this.db.delete(messages);
    } catch (error) {
      console.error("Error clearing messages:", error);
      throw error;
    }
  }
}

export const storage = new DbStorage();
