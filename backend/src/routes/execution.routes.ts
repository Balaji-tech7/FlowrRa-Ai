import { Router } from "express";
import ExecutionController from "../controllers/execution.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, ExecutionController.run);

export default router;
