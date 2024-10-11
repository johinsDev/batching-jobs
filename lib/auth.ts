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
    async sendResetPassword(url, user) {
      console.log("sendResetPassword", url, user)

      // const res = await resend.emails.send({
      // 	from,
      // 	to: user.email,
      // 	subject: "Reset your password",
      // 	react: reactResetPasswordEmail({
      // 		username: user.email,
      // 		resetLink: url,
      // 	}),
      // });
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
    },
  },
})
