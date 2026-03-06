"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: parseInt(process.env.PORT || "8000"),
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    wsMaxConnections: parseInt(process.env.WS_MAX_CONNECTIONS || "100"),
    siteUrl: process.env.SITE_URL || "http://localhost:3000",
    openRouterKey: process.env.OPENROUTER_API_KEY || "",
};
//# sourceMappingURL=index.js.map