import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ExecutionService {
  static async run(workflowId: string, userId: string, input: any) {
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
