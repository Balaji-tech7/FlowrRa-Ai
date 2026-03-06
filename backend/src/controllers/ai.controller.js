"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_service_1 = __importDefault(require("../services/ai.service"));
const openrouter_service_1 = require("../services/openrouter.service");
const ws_1 = require("../ws");
class AIController {
    static async chat(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const { prompt, model, messages } = req.body;
            const streamId = `${req.user.id}-${Date.now()}`;
            openrouter_service_1.openRouterService.startAIStream({
                model,
                messages: messages || [{ role: "user", content: prompt }],
                userId: req.user.id,
                streamId,
            });
            res.json({ success: true, streamId });
        }
        catch (err) {
            console.error("ai chat", err);
            res.status(500).json({ error: err.message });
        }
    }
    static async stopStream(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const { streamId } = req.params;
            const stopped = openrouter_service_1.openRouterService.stopStream(streamId);
            res.json({ success: stopped });
        }
        catch (err) {
            console.error("ai stop stream", err);
            res.status(500).json({ error: err.message });
        }
    }
    static async getModels(_req, res) {
        try {
            const models = await openrouter_service_1.openRouterService.getAvailableModels();
            res.json(models);
        }
        catch (err) {
            console.error("ai get models", err);
            res.status(500).json({ error: err.message });
        }
    }
}
exports.default = AIController;
//# sourceMappingURL=ai.controller.js.map