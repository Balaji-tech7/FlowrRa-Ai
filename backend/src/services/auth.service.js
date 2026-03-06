"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthService {
    static async register(email, password) {
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashed },
        });
        return { id: user.id, email: user.email };
    }
    static async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("Invalid credentials");
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.default.jwtSecret, {
            expiresIn: "1h",
        });
        return token;
    }
    static async getUserById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map