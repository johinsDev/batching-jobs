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
  emailVerification: {
    async sendVerificationEmail(user, url, token) {
      console.log("sendVerificationEmail", user, url, token)
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword(url, user) {
      console.log("sendResetPassword", url, user)
    },
  },
  socialProviders: {
    github: {
      clientId: env.CLIENT_ID_GITHUB || "",
      clientSecret: env.CLIENT_SECRET_GITHUB || "",
    },
  },
})
