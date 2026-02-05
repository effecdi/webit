
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);

  // Events Routes
  app.get(api.events.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const mode = req.query.mode as string | undefined;
    const events = await storage.getEvents(userId, mode);
    res.json(events);
  });

  app.post(api.events.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const input = api.events.create.input.parse(req.body);
    const event = await storage.createEvent({ ...input, userId });
    res.status(201).json(event);
  });

  app.put(api.events.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const id = parseInt(req.params.id);
    const input = api.events.update.input.parse(req.body);
    const event = await storage.updateEvent(id, input);
    res.json(event);
  });

  app.delete(api.events.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const id = parseInt(req.params.id);
    await storage.deleteEvent(id);
    res.status(204).send();
  });

  // Expenses Routes
  app.get(api.expenses.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const expenses = await storage.getExpenses(userId);
    res.json(expenses);
  });

  app.post(api.expenses.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const input = api.expenses.create.input.parse(req.body);
    const expense = await storage.createExpense({ ...input, userId });
    res.status(201).json(expense);
  });

  // Photos Routes
  app.get(api.photos.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const mode = req.query.mode as string | undefined;
    const photos = await storage.getPhotos(userId, mode);
    res.json(photos);
  });

  app.post(api.photos.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const input = api.photos.create.input.parse(req.body);
    const photo = await storage.createPhoto({ ...input, userId });
    res.status(201).json(photo);
  });

  // Widgets Routes
  app.get(api.widgets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const widgets = await storage.getWidgets(userId);
    res.json(widgets);
  });

  // Membership (Demo Endpoint)
  app.post("/api/membership/subscribe", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    const userId = (req.user as any).claims.sub;
    const user = await storage.updateMembership(userId, true, "premium");
    res.json(user);
  });

  return httpServer;
}
