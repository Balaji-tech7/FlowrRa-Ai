"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class WorkflowService {
    static async create(userId, data) {
        // ensure a definition string is provided (could be JSON serialized)
        return prisma.workflow.create({
            data: { ...data, userId },
        });
    }
    static async list(userId) {
        return prisma.workflow.findMany({ where: { userId } });
    }
    static async get(id) {
        const wf = await prisma.workflow.findUnique({ where: { id } });
        if (!wf)
            throw new Error("Workflow not found");
        return wf;
    }
}
exports.default = WorkflowService;
//# sourceMappingURL=workflow.service.js.map