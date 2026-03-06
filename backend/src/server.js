"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./config"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const workflow_routes_1 = __importDefault(require("./routes/workflow.routes"));
const execution_routes_1 = __importDefault(require("./routes/execution.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const ws_1 = require("./ws");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize WebSocket server
const wss = (0, ws_1.initWebsocket)(server);
// Trust proxy if behind reverse proxy
app.set("trust proxy", 1);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "ws:", "wss:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
// CORS configuration
const corsOptions = {
    origin: config_1.default.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
};
app.use((0, cors_1.default)(corsOptions));
// Request ID and logging middleware
app.use((req, res, next) => {
    req.requestId = crypto.randomUUID();
    res.setHeader("X-Request-ID", req.requestId);
    const start = Date.now();
    res.on("finish", () => {
        logger_1.default.info({
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: Date.now() - start,
            requestId: req.requestId,
            ip: req.ip,
        });
    });
    next();
});
// Body parsing (built into express, no body-parser needed)
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Health check
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "FlowRai Backend",
        version: process.env.npm_package_version || "1.0.0",
        environment: config_1.default.nodeEnv,
        uptime: process.uptime(),
        wsConnections: wss.clients.size,
        memory: process.memoryUsage(),
    });
});
// WebSocket info endpoint
app.get("/ws/info", (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    res.json({
        wsUrl: `${protocol === "https" ? "wss" : "ws"}://${host}/ws`,
        authRequired: true,
        supportedProtocols: [
            "Bearer token in subprotocol",
            "token query parameter",
        ],
        connections: {
            active: wss.clients.size,
            max: config_1.default.wsMaxConnections,
        },
    });
});
// API Routes
app.use("/auth", auth_routes_1.default);
app.use("/workflows", workflow_routes_1.default);
app.use("/executions", execution_routes_1.default);
app.use("/ai", ai_routes_1.default);
// 404 handler
app.use((_req, res) => {
    res
        .status(404)
        .json({ error: "Not Found", message: "Endpoint does not exist" });
});
// Global error handler
app.use(error_middleware_1.errorHandler);
const PORT = config_1.default.port || 8000;
server.listen(PORT, "0.0.0.0", () => {
    logger_1.default.info(`Server ready on port ${PORT}`);
    logger_1.default.info(`Health: http://localhost:${PORT}/health`);
    logger_1.default.info(`WebSocket: ws://localhost:${PORT}/ws`);
    logger_1.default.info(`Environment: ${config_1.default.nodeEnv}`);
});
// Graceful shutdown
const SHUTDOWN_TIMEOUT = 10000;
const shutdown = (signal) => {
    logger_1.default.info(`${signal} received, starting graceful shutdown...`);
    server.close(() => {
        logger_1.default.info("HTTP server closed");
    });
    if (wss) {
        logger_1.default.info(`Closing ${wss.clients.size} WebSocket connections...`);
        wss.clients.forEach((ws) => {
            ws.close(1001, "Server shutting down");
        });
        setTimeout(() => {
            wss.clients.forEach((ws) => {
                if (ws.readyState === ws.OPEN)
                    ws.terminate();
            });
            wss.close();
        }, SHUTDOWN_TIMEOUT - 1000);
    }
    setTimeout(() => {
        logger_1.default.error("Forced shutdown due to timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (err) => {
    logger_1.default.error("Uncaught Exception:", err);
    shutdown("uncaughtException");
});
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
});
//# sourceMappingURL=server.js.map