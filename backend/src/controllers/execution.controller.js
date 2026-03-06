"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const execution_service_1 = __importDefault(require("../services/execution.service"));
const ws_1 = require("../ws");
class ExecutionController {
    static async run(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const { workflowId, input } = req.body;
            (0, ws_1.broadcastToUser)(req.user.id, { type: "execution.start", workflowId });
            const execution = await execution_service_1.default.run(workflowId, req.user.id, input);
            (0, ws_1.broadcastToUser)(req.user.id, { type: "execution.complete", execution });
            res.json({ success: true, data: execution });
        }
        catch (err) {
            console.error("execution run", err);
            res.status(400).json({ error: err.message });
        }
    }
}
exports.default = ExecutionController;
//# sourceMappingURL=execution.controller.js.map