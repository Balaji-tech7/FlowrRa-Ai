import { Request, Response } from "express";
export default class ExecutionController {
    static run(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=execution.controller.d.ts.map