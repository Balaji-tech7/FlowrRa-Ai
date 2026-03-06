"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.authenticate = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token)
            return res.status(401).json({ error: "No token provided" });
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        const user = await auth_service_1.default.getUserById(decoded.userId);
        if (!user)
            return res.status(401).json({ error: "User not found" });
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
// keep previous export name for routes
exports.authMiddleware = exports.authenticate;
//# sourceMappingURL=auth.middleware.js.map