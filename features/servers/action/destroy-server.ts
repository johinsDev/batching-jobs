"use server"

import { redirect } from "next/navigation"
import { runs } from "@trigger.dev/sdk/v3"
import { eq } from "drizzle-orm"
import { zfd } from "zod-form-data"

import { db } from "@/lib/db"
import { jobBatch, server } from "@/lib/db/schema"
import { actionClient } from "@/lib/safe-action"

const destroyServerSchema = zfd.formData({
  batchId: zfd.text(),
})

export const destroyServer = actionClient
  .schema(destroyServerSchema)
  .action(async ({ parsedInput: { batchId } }) => {
    console.log("Destroying server...", batchId)

    await runs.cancel(batchId)

    await db.delete(server).where(eq(server.batchId, batchId))
    await db.delete(jobBatch).where(eq(jobBatch.id, batchId))

    return redirect("/servers")
  })
