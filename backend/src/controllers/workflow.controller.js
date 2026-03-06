"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workflow_service_1 = __importDefault(require("../services/workflow.service"));
const ws_1 = require("../ws");
class WorkflowController {
    static async create(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const { name, description, definition } = req.body;
            const workflow = await workflow_service_1.default.create(req.user.id, {
                name,
                description,
                definition,
            });
            (0, ws_1.broadcastToUser)(req.user.id, { type: "workflow.created", workflow });
            res.json({ success: true, data: workflow });
        }
        catch (err) {
            console.error("workflow create", err);
            res.status(400).json({ error: err.message });
        }
    }
    static async list(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const workflows = await workflow_service_1.default.list(req.user.id);
            res.json({ success: true, data: workflows });
        }
        catch (err) {
            console.error("workflow list", err);
            res.status(500).json({ error: err.message });
        }
    }
    static async get(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const workflow = await workflow_service_1.default.get(req.params.id);
            res.json({ success: true, data: workflow });
        }
        catch (err) {
            console.error("workflow get", err);
            res.status(404).json({ error: err.message });
        }
    }
}
exports.default = WorkflowController;
//# sourceMappingURL=workflow.controller.js.map