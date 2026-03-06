"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../src/routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
describe("Auth Routes", () => {
    it("register returns 400 missing fields", async () => {
        const res = await (0, supertest_1.default)(app).post("/auth/register").send({});
        expect(res.status).toBe(400);
    });
});
//# sourceMappingURL=auth.controller.test.js.map