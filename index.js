import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors"
import { mcpRouter } from "./router/mcp.route.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
cors({})

//middleware;
app.use(cors());
app.use(express.json());

app.use("/api/mcp/execute",mcpRouter);


server.listen(process.env.PORT || 5174, () => {
  console.log("server is running");
});
