"use server"

import { createServer as createServerDb } from "@/features/servers/data-access/create-server"
import { zfd } from "zod-form-data"

import { actionClient } from "@/lib/safe-action"

const createServerSchema = zfd.formData({})

export const createServer = actionClient
  .schema(createServerSchema)
  .action(async () => {
    await createServerDb()
    console.log("Server created")
    // Create server logic here
    return { status: "success" }
  })
