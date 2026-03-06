// previously stored AI interactions, but schema no longer contains AIRecord.
// this service now simply returns a dummy echo response.

export default class AIService {
  static async chat(message: string) {
    const output = `Echo: ${message}`;
    // optionally log or persist elsewhere
    return { message: output };
  }
}
