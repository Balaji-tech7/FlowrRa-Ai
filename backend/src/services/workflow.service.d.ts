export default class WorkflowService {
    static create(userId: string, data: {
        name: string;
        definition: string;
        description?: string;
    }): Promise<$Result.GetResult<import(".prisma/client").Prisma.$WorkflowPayload<ExtArgs>, T, "create">>;
    static list(userId: string): Promise<$Public.PrismaPromise<T>>;
    static get(id: string): Promise<any>;
}
//# sourceMappingURL=workflow.service.d.ts.map