import { Router } from "express";
import WorkflowController from "../controllers/workflow.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, WorkflowController.create);
router.get("/", authMiddleware, WorkflowController.list);
router.get("/:id", authMiddleware, WorkflowController.get);

export default router;
