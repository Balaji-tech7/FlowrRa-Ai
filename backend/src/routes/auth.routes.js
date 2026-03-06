"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validation_middleware_1 = require("../middleware/validation.middleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_middleware_1.validationMiddleware)(validation_1.registerSchema), auth_controller_1.default.register);
router.post("/login", (0, validation_middleware_1.validationMiddleware)(validation_1.loginSchema), auth_controller_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map