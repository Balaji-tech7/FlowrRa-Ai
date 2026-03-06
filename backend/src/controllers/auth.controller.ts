import { Request, Response } from "express";
import AuthService from "../services/auth.service";

export default class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.register(email, password);
      res.json({ success: true, data: user });
    } catch (err: any) {
      console.error("auth register", err);
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await AuthService.login(email, password);
      res.json({ success: true, data: { token } });
    } catch (err: any) {
      console.error("auth login", err);
      res.status(401).json({ error: err.message });
    }
  }
}
