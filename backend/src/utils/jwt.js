"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.verify = verify;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
function sign(payload) {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "1h" });
}
function verify(token) {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
}
//# sourceMappingURL=jwt.js.map