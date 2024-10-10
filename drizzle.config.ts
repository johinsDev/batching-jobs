import type { Config } from "drizzle-kit"

export default {
  schema: "./lib/db/schema.ts",
  dialect: "turso",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
} satisfies Config
