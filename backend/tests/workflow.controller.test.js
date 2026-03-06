"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const workflow_routes_1 = __importDefault(require("../src/routes/workflow.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/workflows", workflow_routes_1.default);
describe("Workflow Routes", () => {
    it("should require auth", async () => {
        const res = await (0, supertest_1.default)(app).get("/workflows");
        expect(res.status).toBe(401);
    });
});
//# sourceMappingURL=workflow.controller.test.js.map