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
      // tasks.batchTrigger<typeof helloWorldTask>(
      //   "hello-world",
      //   new Array(10).fill(0).map((_, i) => ({
      //     payload: {
      //       user,
      //       url,
      //       token,
      //       i,
      //     },
      //     options: {},
      //   }))
      // )
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
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
    },
  },
})
