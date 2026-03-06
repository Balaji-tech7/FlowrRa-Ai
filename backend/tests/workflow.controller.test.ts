import request from "supertest";
import express from "express";
import workflowRoutes from "../src/routes/workflow.routes";

const app = express();
app.use(express.json());
app.use("/workflows", workflowRoutes);

describe("Workflow Routes", () => {
  it("should require auth", async () => {
    const res = await request(app).get("/workflows");
    expect(res.status).toBe(401);
  });
});
