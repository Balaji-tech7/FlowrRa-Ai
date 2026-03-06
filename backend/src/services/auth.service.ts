import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AuthService {
  static async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    return { id: user.id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: "1h",
      },
    );
    return token;
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
