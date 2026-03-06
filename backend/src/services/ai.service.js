"use strict";
// previously stored AI interactions, but schema no longer contains AIRecord.
// this service now simply returns a dummy echo response.
Object.defineProperty(exports, "__esModule", { value: true });
class AIService {
    static async chat(message) {
        const output = `Echo: ${message}`;
        // optionally log or persist elsewhere
        return { message: output };
    }
}
exports.default = AIService;
//# sourceMappingURL=ai.service.js.map