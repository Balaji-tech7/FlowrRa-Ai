"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workflow_controller_1 = __importDefault(require("../controllers/workflow.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authMiddleware, workflow_controller_1.default.create);
router.get("/", auth_middleware_1.authMiddleware, workflow_controller_1.default.list);
router.get("/:id", auth_middleware_1.authMiddleware, workflow_controller_1.default.get);
exports.default = router;
//# sourceMappingURL=workflow.routes.js.map