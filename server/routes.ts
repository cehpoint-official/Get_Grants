import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Firebase handles all data persistence directly from the client
  // No server-side API routes needed for this application
  
  const httpServer = createServer(app);

  return httpServer;
}
