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
exports.initWebsocket = initWebsocket;
exports.closeWebsocket = closeWebsocket;
exports.broadcastToUser = broadcastToUser;
exports.broadcastToAll = broadcastToAll;
exports.getConnectedUsers = getConnectedUsers;
exports.getUserConnectionCount = getUserConnectionCount;
exports.getTotalConnections = getTotalConnections;
const ws_1 = __importStar(require("ws"));
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const auth_service_1 = __importDefault(require("./services/auth.service"));
const logger_1 = __importDefault(require("./utils/logger"));
const clients = new Map();
let heartbeatInterval = null;
function initWebsocket(server) {
    const wss = new ws_1.Server({ server, clientTracking: true });
    wss.on("connection", async (ws, req) => {
        const extWs = ws;
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
            let decoded;
            try {
                const result = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
                if (typeof result !== "object" ||
                    result === null ||
                    !("id" in result)) {
                    extWs.close(1008, "Unauthorized: Invalid token");
                    return;
                }
                decoded = result;
            }
            catch (err) {
                extWs.close(1008, "Unauthorized: Token verification failed");
                return;
            }
            const userId = decoded.id;
            extWs.userId = userId;
            const user = await auth_service_1.default.getUserById(userId);
            if (!user) {
                extWs.close(1008, "Unauthorized: User not found");
                return;
            }
            if (!clients.has(userId))
                clients.set(userId, new Set());
            clients.get(userId).add(extWs);
            logger_1.default.info(`WebSocket connected: User ${userId}, Total users: ${clients.size}`);
            extWs.send(JSON.stringify({
                type: "connection_established",
                userId,
                timestamp: new Date().toISOString(),
                message: "WebSocket connection established",
            }));
            extWs.on("message", (data) => {
                try {
                    const parsed = JSON.parse(data.toString());
                    if (parsed.type === "ping") {
                        extWs.send(JSON.stringify({
                            type: "pong",
                            timestamp: new Date().toISOString(),
                        }));
                    }
                    else {
                        logger_1.default.debug(`Message from ${userId}:`, parsed);
                    }
                }
                catch (err) {
                    extWs.send(JSON.stringify({
                        type: "error",
                        message: "Invalid message format",
                        error: err.message,
                    }));
                }
            });
            extWs.on("close", (code, reason) => {
                const set = clients.get(userId);
                if (set) {
                    set.delete(extWs);
                    if (set.size === 0)
                        clients.delete(userId);
                }
                const reasonStr = reason?.toString() ?? "";
                logger_1.default.info(`WebSocket disconnected: User ${userId}, Code: ${code}, Reason: ${reasonStr}`);
            });
            extWs.on("error", (err) => {
                logger_1.default.error(`WebSocket error for user ${userId}:`, err);
            });
        }
        catch (err) {
            logger_1.default.error("WebSocket authentication error:", err);
            extWs.close(1008, "Unauthorized");
        }
    });
    // Heartbeat — terminates dead connections
    heartbeatInterval = setInterval(() => {
        wss.clients.forEach((client) => {
            const extClient = client;
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
function closeWebsocket(wss) {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
    wss.close();
}
function extractTokenFromRequest(req) {
    const url = req.url ?? "";
    const query = url.includes("?") ? url.split("?")[1] : "";
    const params = new URLSearchParams(query);
    const tokenFromQuery = params.get("token");
    if (tokenFromQuery)
        return tokenFromQuery;
    const protocolHeader = req.headers["sec-websocket-protocol"];
    if (protocolHeader) {
        const protocols = Array.isArray(protocolHeader)
            ? protocolHeader
            : [protocolHeader];
        for (const p of protocols) {
            if (p.startsWith("Bearer "))
                return p.slice(7);
            if (p.includes("."))
                return p;
        }
    }
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer "))
        return authHeader.slice(7);
    return null;
}
function broadcastToUser(userId, data) {
    const set = clients.get(userId);
    if (!set)
        return;
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    set.forEach((ws) => {
        if (ws.readyState === ws_1.default.OPEN)
            ws.send(payload);
    });
}
function broadcastToAll(data) {
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    clients.forEach((set) => set.forEach((ws) => {
        if (ws.readyState === ws_1.default.OPEN)
            ws.send(payload);
    }));
}
function getConnectedUsers() {
    return Array.from(clients.keys());
}
function getUserConnectionCount(userId) {
    return clients.get(userId)?.size ?? 0;
}
function getTotalConnections() {
    let total = 0;
    clients.forEach((set) => (total += set.size));
    return total;
}
exports.default = {
    initWebsocket,
    closeWebsocket,
    broadcastToUser,
    broadcastToAll,
    getConnectedUsers,
    getUserConnectionCount,
    getTotalConnections,
};
//# sourceMappingURL=ws.js.map