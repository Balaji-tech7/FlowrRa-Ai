import WebSocket, { Server } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import config from "./config";
import AuthService from "./services/auth.service";
import logger from "./utils/logger";

interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
}

const clients = new Map<string, Set<ExtendedWebSocket>>();
let heartbeatInterval: NodeJS.Timeout | null = null;

export function initWebsocket(server: http.Server): Server {
  const wss = new Server({ server, clientTracking: true });

  wss.on("connection", async (ws: WebSocket, req: http.IncomingMessage) => {
    const extWs = ws as ExtendedWebSocket;
    extWs.isAlive = true;
    extWs.userId = undefined;

    extWs.on("pong", () => {
      extWs.isAlive = true;
    });

    try {
      const token = extractTokenFromRequest(req);
      if (!token) {
        extWs.close(1008, "Unauthorized: No token provided");
        return;
      }

      let decoded: jwt.JwtPayload;
      try {
        const result = jwt.verify(token, config.jwtSecret);
        if (
          typeof result !== "object" ||
          result === null ||
          !("id" in result)
        ) {
          extWs.close(1008, "Unauthorized: Invalid token");
          return;
        }
        decoded = result as jwt.JwtPayload;
      } catch (err) {
        extWs.close(1008, "Unauthorized: Token verification failed");
        return;
      }

      const userId = (decoded as { id: string }).id;
      extWs.userId = userId;

      const user = await AuthService.getUserById(userId);
      if (!user) {
        extWs.close(1008, "Unauthorized: User not found");
        return;
      }

      if (!clients.has(userId)) clients.set(userId, new Set());
      clients.get(userId)!.add(extWs);

      logger.info(
        `WebSocket connected: User ${userId}, Total users: ${clients.size}`
      );

      extWs.send(
        JSON.stringify({
          type: "connection_established",
          userId,
          timestamp: new Date().toISOString(),
          message: "WebSocket connection established",
        })
      );

      extWs.on("message", (data: WebSocket.RawData) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.type === "ping") {
            extWs.send(
              JSON.stringify({
                type: "pong",
                timestamp: new Date().toISOString(),
              })
            );
          } else {
            logger.debug(`Message from ${userId}:`, parsed);
          }
        } catch (err: any) {
          extWs.send(
            JSON.stringify({
              type: "error",
              message: "Invalid message format",
              error: err.message,
            })
          );
        }
      });

      extWs.on("close", (code: number, reason: Buffer) => {
        const set = clients.get(userId);
        if (set) {
          set.delete(extWs);
          if (set.size === 0) clients.delete(userId);
        }
        const reasonStr = reason?.toString() ?? "";
        logger.info(
          `WebSocket disconnected: User ${userId}, Code: ${code}, Reason: ${reasonStr}`
        );
      });

      extWs.on("error", (err: Error) => {
        logger.error(`WebSocket error for user ${userId}:`, err);
      });
    } catch (err: any) {
      logger.error("WebSocket authentication error:", err);
      extWs.close(1008, "Unauthorized");
    }
  });

  // Heartbeat — terminates dead connections
  heartbeatInterval = setInterval(() => {
    wss.clients.forEach((client) => {
      const extClient = client as ExtendedWebSocket;
      if (!extClient.isAlive) {
        extClient.terminate();
        return;
      }
      extClient.isAlive = false;
      extClient.ping();
    });
  }, 30000);

  return wss;
}

export function closeWebsocket(wss: Server): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  wss.close();
}

function extractTokenFromRequest(req: http.IncomingMessage): string | null {
  const url = req.url ?? "";
  const query = url.includes("?") ? url.split("?")[1] : "";
  const params = new URLSearchParams(query);
  const tokenFromQuery = params.get("token");
  if (tokenFromQuery) return tokenFromQuery;

  const protocolHeader = req.headers["sec-websocket-protocol"];
  if (protocolHeader) {
    const protocols = Array.isArray(protocolHeader)
      ? protocolHeader
      : [protocolHeader];
    for (const p of protocols) {
      if (p.startsWith("Bearer ")) return p.slice(7);
      if (p.includes(".")) return p;
    }
  }

  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

  return null;
}

export function broadcastToUser(userId: string, data: unknown): void {
  const set = clients.get(userId);
  if (!set) return;
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  set.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  });
}

export function broadcastToAll(data: unknown): void {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  clients.forEach((set) =>
    set.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(payload);
    })
  );
}

export function getConnectedUsers(): string[] {
  return Array.from(clients.keys());
}

export function getUserConnectionCount(userId: string): number {
  return clients.get(userId)?.size ?? 0;
}

export function getTotalConnections(): number {
  let total = 0;
  clients.forEach((set) => (total += set.size));
  return total;
}

export default {
  initWebsocket,
  closeWebsocket,
  broadcastToUser,
  broadcastToAll,
  getConnectedUsers,
  getUserConnectionCount,
  getTotalConnections,
};
