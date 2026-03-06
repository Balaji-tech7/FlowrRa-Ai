import { Request, Response } from "express";
export default class WorkflowController {
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static get(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=workflow.controller.d.ts.map