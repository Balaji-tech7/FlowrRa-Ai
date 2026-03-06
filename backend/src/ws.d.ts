import { Server } from "ws";
import http from "http";
export declare function initWebsocket(server: http.Server): Server;
export declare function closeWebsocket(wss: Server): void;
export declare function broadcastToUser(userId: string, data: unknown): void;
export declare function broadcastToAll(data: unknown): void;
export declare function getConnectedUsers(): string[];
export declare function getUserConnectionCount(userId: string): number;
export declare function getTotalConnections(): number;
declare const _default: {
    initWebsocket: typeof initWebsocket;
    closeWebsocket: typeof closeWebsocket;
    broadcastToUser: typeof broadcastToUser;
    broadcastToAll: typeof broadcastToAll;
    getConnectedUsers: typeof getConnectedUsers;
    getUserConnectionCount: typeof getUserConnectionCount;
    getTotalConnections: typeof getTotalConnections;
};
export default _default;
//# sourceMappingURL=ws.d.ts.map