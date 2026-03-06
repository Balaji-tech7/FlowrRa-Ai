import { Request, Response } from "express";
import WorkflowService from "../services/workflow.service";
import { broadcastToUser } from "../ws";

export default class WorkflowController {
  static async create(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { name, description, definition } = req.body;
      const workflow = await WorkflowService.create(req.user.id, {
        name,
        description,
        definition,
      });
      broadcastToUser(req.user.id, { type: "workflow.created", workflow });
      res.json({ success: true, data: workflow });
    } catch (err: any) {
      console.error("workflow create", err);
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const workflows = await WorkflowService.list(req.user.id);
      res.json({ success: true, data: workflows });
    } catch (err: any) {
      console.error("workflow list", err);
      res.status(500).json({ error: err.message });
    }
  }

  static async get(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const workflow = await WorkflowService.get(req.params.id);
      res.json({ success: true, data: workflow });
    } catch (err: any) {
      console.error("workflow get", err);
      res.status(404).json({ error: err.message });
    }
  }
}
