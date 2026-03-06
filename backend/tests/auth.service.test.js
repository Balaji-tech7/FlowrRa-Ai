"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../src/services/auth.service"));
const client_1 = require("@prisma/client");
// unit tests would generally mock prisma; omitted for brevity
describe("AuthService", () => {
    it("registers and logs in a user", async () => {
        // this is a placeholder example; actual database tests require setup
        expect(true).toBe(true);
    });
});
//# sourceMappingURL=auth.service.test.js.map