declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
            requestId: string;
        }
    }
}
export {};
//# sourceMappingURL=server.d.ts.map