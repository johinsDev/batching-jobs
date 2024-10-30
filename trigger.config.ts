import { defineConfig } from "@trigger.dev/sdk/v3"
import dotenv from "dotenv"

dotenv.config()
console.log("Project ID:", process.env.TRIGGER_PROJECT_ID)
export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID!,
  runtime: "node",
  logLevel: "log",
  // Set the maxDuration to 300 seconds for all tasks. See https://trigger.dev/docs/runs/max-duration
  // maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    // Exclude native modules from bundling
    external: ["@libsql/linux-x64-gnu", "libsql", "@libsql/client"],
  },
  dirs: ["features/servers/trigger"],
})
