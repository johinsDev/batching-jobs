"use server"

// don't forget to add this!
import { z } from "zod"
import { zfd } from "zod-form-data"

import { actionClient } from "@/lib/safe-action"

// This schema is used to validate input from client.
const schema = zfd.formData({
  email: zfd.text(z.string().min(3).max(255).email()),
  password: zfd.text(z.string().min(8).max(255)),
})

export const singIn = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email, password } }) => {
    if (email === "johndoe@gmail.com" && password === "12345678") {
      return {
        success: "Successfully logged in",
      }
    }

    return { failure: "Incorrect credentials" }
  })
