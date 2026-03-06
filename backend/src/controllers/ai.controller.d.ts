import { Request, Response } from "express";
export default class AIController {
    static chat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static stopStream(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getModels(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map