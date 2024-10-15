"use server"

import { ApiError } from "@/features/auth/types"
import { signInSchema } from "@/features/auth/validations/sign-in-schema"
import { returnValidationErrors } from "next-safe-action"

import { client } from "@/lib/auth-client"
import { actionClient } from "@/lib/safe-action"

export const signIn = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await client.signIn.email({
        email: parsedInput.email,
        password: parsedInput.password,
        dontRememberMe: !parsedInput.rememberMe,
      })

      console.log(res)
    } catch (error) {
      const e = error as ApiError

      returnValidationErrors(signInSchema, {
        email: {
          _errors: [e.body.message ?? "Invalid email or password"],
        },
      })
    }

    return {
      successful: true,
    }
  })
