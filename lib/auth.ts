import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { env } from "@/lib/env.mjs"

import { db } from "./db"
import * as schema from "./db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
    usePlural: false,
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "email-password"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
    },
  },
})
