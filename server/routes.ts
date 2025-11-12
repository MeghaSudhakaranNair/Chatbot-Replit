import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";
import { chatRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatRequestSchema.parse(req.body);

      // Store user message
      await storage.addMessage({
        text: message,
        isUser: true,
      });

      // Get conversation history
      const history = await storage.getMessages();
      
      // Build chat context from history
      const contents = history
        .slice(-10) // Last 10 messages for context
        .map((msg) => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

      // Generate response with conversation history
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents,
      });

      const aiMessage = response.text || "Sorry, I couldn't generate a response.";

      // Store AI response
      const savedMessage = await storage.addMessage({
        text: aiMessage,
        isUser: false,
      });

      res.json({
        message: aiMessage,
        id: savedMessage.id,
        timestamp: savedMessage.timestamp,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: "Failed to get response from AI",
      });
    }
  });

  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.delete("/api/messages", async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error) {
      console.error("Clear messages error:", error);
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
