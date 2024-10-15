import { z } from "zod"

import { emailSchema } from "./email-schema"
import { passwordSchema } from "./password-schema"

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().nullable().optional(),
})
