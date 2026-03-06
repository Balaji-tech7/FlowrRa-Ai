"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ExecutionService {
    static async run(workflowId, userId, input) {
        // convert input to string since schema uses String
        const exec = await prisma.execution.create({
            data: {
                workflowId,
                userId,
                status: "running",
                input: JSON.stringify(input),
            },
        });
        // In a real app, you might queue actual execution and update output later
        return exec;
    }
}
exports.default = ExecutionService;
//# sourceMappingURL=execution.service.js.map