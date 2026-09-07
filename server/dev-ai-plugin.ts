import { loadEnv, type Plugin } from "vite";
import { handleAiRequest } from "./handler.js";
import type { AiEndpointOptions } from "./ai.js";

const DEFAULT_MODEL = "gemini-3.6-flash";

export function devAiPlugin(): Plugin {
  const options: AiEndpointOptions = { apiKey: "", model: DEFAULT_MODEL };

  return {
    name: "dev-ai-analyst",
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, "");
      options.apiKey = env.GEMINI_API_KEY ?? "";
      options.model = env.GEMINI_MODEL || DEFAULT_MODEL;
    },
    configureServer(server) {
      server.middlewares.use("/api/ai/analyze", (req, res) => {
        void handleAiRequest(req, res, options);
      });
    },
  };
}
