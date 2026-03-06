"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    static async register(req, res) {
        const { email, password } = req.body;
        try {
            const user = await auth_service_1.default.register(email, password);
            res.json({ success: true, data: user });
        }
        catch (err) {
            console.error("auth register", err);
            res.status(400).json({ error: err.message });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const token = await auth_service_1.default.login(email, password);
            res.json({ success: true, data: { token } });
        }
        catch (err) {
            console.error("auth login", err);
            res.status(401).json({ error: err.message });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map