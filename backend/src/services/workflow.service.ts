import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class WorkflowService {
  static async create(
    userId: string,
    data: { name: string; definition: string; description?: string },
  ) {
    // ensure a definition string is provided (could be JSON serialized)
    return prisma.workflow.create({
      data: { ...data, userId },
    });
  }

  static async list(userId: string) {
    return prisma.workflow.findMany({ where: { userId } });
  }

  static async get(id: string) {
    const wf = await prisma.workflow.findUnique({ where: { id } });
    if (!wf) throw new Error("Workflow not found");
    return wf;
  }
}
