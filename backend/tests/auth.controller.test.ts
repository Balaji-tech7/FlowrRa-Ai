import request from "supertest";
import express from "express";
import authRoutes from "../src/routes/auth.routes";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  it("register returns 400 missing fields", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.status).toBe(400);
  });
});
