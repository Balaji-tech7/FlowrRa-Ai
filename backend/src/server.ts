import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import config from "./config";
import authRoutes from "./routes/auth.routes";
import workflowRoutes from "./routes/workflow.routes";
import executionRoutes from "./routes/execution.routes";
import aiRoutes from "./routes/ai.routes";
import { errorHandler } from "./middleware/error.middleware";
import { initWebsocket } from "./ws";
import logger from "./utils/logger";

// Extend Express Request type globally
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
      requestId: string;
    }
  }
}

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = initWebsocket(server);

// Trust proxy if behind reverse proxy
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
const corsOptions = {
  origin: config.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
};
app.use(cors(corsOptions));

// Request ID and logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-ID", req.requestId);

  const start = Date.now();
  res.on("finish", () => {
    logger.info({
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "FlowRai Backend",
    version: process.env.npm_package_version || "1.0.0",
    environment: config.nodeEnv,
    uptime: process.uptime(),
    wsConnections: wss.clients.size,
    memory: process.memoryUsage(),
  });
});

// WebSocket info endpoint
app.get("/ws/info", (req: Request, res: Response) => {
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
      max: config.wsMaxConnections,
    },
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/workflows", workflowRoutes);
app.use("/executions", executionRoutes);
app.use("/ai", aiRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res
    .status(404)
    .json({ error: "Not Found", message: "Endpoint does not exist" });
});

// Global error handler
app.use(errorHandler);

const PORT = config.port || 8000;
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server ready on port ${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/health`);
  logger.info(`WebSocket: ws://localhost:${PORT}/ws`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
const SHUTDOWN_TIMEOUT = 10000;

const shutdown = (signal: string) => {
  logger.info(`${signal} received, starting graceful shutdown...`);

  server.close(() => {
    logger.info("HTTP server closed");
  });

  if (wss) {
    logger.info(`Closing ${wss.clients.size} WebSocket connections...`);

    wss.clients.forEach((ws) => {
      ws.close(1001, "Server shutting down");
    });

    setTimeout(() => {
      wss.clients.forEach((ws) => {
        if (ws.readyState === ws.OPEN) ws.terminate();
      });
      wss.close();
    }, SHUTDOWN_TIMEOUT - 1000);
  }

  setTimeout(() => {
    logger.error("Forced shutdown due to timeout");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
