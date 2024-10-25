import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { jobBatch, NewJobBatch } from "@/lib/db/schema"
import { nanoid } from "@/lib/utils"

export async function createBatch(data: Omit<NewJobBatch, "id">) {
  try {
    await db.insert(jobBatch).values({
      id: nanoid(),
      failedJobs: 0,
      name: data.name,
      pendingJobs: data.pendingJobs,
      totalJobs: data.totalJobs,
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateBatch(id: string, data: Partial<NewJobBatch>) {
  try {
    await db.update(jobBatch).set(data).where(eq(jobBatch.id, id))
  } catch (error) {
    console.error(error)
  }
}
