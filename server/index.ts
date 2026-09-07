import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAiRequest } from "./handler.js";
import type { AiEndpointOptions } from "./ai.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const port = Number(process.env.PORT ?? 8080);
const distDir = path.resolve(__dirname, "..", "dist");

const aiOptions: AiEndpointOptions = {
  apiKey: process.env.GEMINI_API_KEY ?? "",
  model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
};

app.post("/api/ai/analyze", (req, res) => {
  void handleAiRequest(req, res, aiOptions);
});

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not found." });
});

app.use(express.static(distDir));

app.use((req, res, next) => {
  if (req.method !== "GET") {
    next();
    return;
  }
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Foreign Exchange Checker running at http://localhost:${port}`);
});
