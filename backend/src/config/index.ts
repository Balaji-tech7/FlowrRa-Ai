import dotenv from "dotenv";
dotenv.config();

export default {
  port: parseInt(process.env.PORT || "8000"),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  wsMaxConnections: parseInt(process.env.WS_MAX_CONNECTIONS || "100"),
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  openRouterKey: process.env.OPENROUTER_API_KEY || "",
};
