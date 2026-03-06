import { Request, Response, NextFunction } from "express";
export declare function validationMiddleware(schema: any): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.middleware.d.ts.map