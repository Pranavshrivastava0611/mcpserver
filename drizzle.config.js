import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
    dialect: "postgresql",
    schema: "./lib/schema.js",
    dbCredentials: {
      url: process.env.DATABASE_URL
    },
  });