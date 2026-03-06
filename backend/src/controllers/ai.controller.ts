import { Request, Response } from "express";
import AIService from "../services/ai.service";
import { openRouterService } from "../services/openrouter.service";
import { broadcastToUser } from "../ws";

export default class AIController {
  static async chat(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { prompt, model, messages } = req.body;
      const streamId = `${req.user.id}-${Date.now()}`;

      openRouterService.startAIStream({
        model,
        messages: messages || [{ role: "user", content: prompt }],
        userId: req.user.id,
        streamId,
      });

      res.json({ success: true, streamId });
    } catch (err: any) {
      console.error("ai chat", err);
      res.status(500).json({ error: err.message });
    }
  }

  static async stopStream(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { streamId } = req.params;
      const stopped = openRouterService.stopStream(streamId);
      res.json({ success: stopped });
    } catch (err: any) {
      console.error("ai stop stream", err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getModels(_req: Request, res: Response) {
    try {
      const models = await openRouterService.getAvailableModels();
      res.json(models);
    } catch (err: any) {
      console.error("ai get models", err);
      res.status(500).json({ error: err.message });
    }
  }
}
