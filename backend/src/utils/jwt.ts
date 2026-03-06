import jwt from "jsonwebtoken";
import config from "../config";

export function sign(payload: object) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
}

export function verify(token: string) {
  return jwt.verify(token, config.jwtSecret);
}
