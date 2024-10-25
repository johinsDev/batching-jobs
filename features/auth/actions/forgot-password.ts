"use server"

// don't forget to add this!
import { z } from "zod"
import { zfd } from "zod-form-data"

import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

import { AuthError } from "../auth-types"
import { getAccountByUserId } from "../data-access/account"
import { getUserByEmail } from "../data-access/users"

// This schema is used to validate input from client.
const schema = zfd.formData({
  email: zfd.text(z.string().min(3).max(255).email()),
})

export const forgotPassword = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email } }) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw AuthError.notFound()
    }

    const account = await getAccountByUserId(user.id, "email")

    if (!account) {
      throw AuthError.accountNotFound("email")
    }

    const res = await auth.api.forgetPassword({
      body: {
        email: user.email,
        redirectTo: "/reset-password",
      },
    })

    if (!res.status) {
      throw AuthError.emailNotSent()
    }

    return { status: "success" }
  })
