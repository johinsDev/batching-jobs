import { z } from "zod"

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(5, "Email must be at least 5 characters long")
  .max(255, "Email must not exceed 255 characters")
  .refine(
    (email) => {
      const [localPart = "", domain = ""] = email.split("@")
      return (
        localPart.length <= 64 &&
        domain.length <= 255 &&
        domain.split(".").every((part) => part.length <= 63)
      )
    },
    {
      message: "Email does not meet additional validation criteria",
    }
  )
