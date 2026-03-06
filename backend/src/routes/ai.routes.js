"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = __importDefault(require("../controllers/ai.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/chat", auth_middleware_1.authMiddleware, ai_controller_1.default.chat);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map