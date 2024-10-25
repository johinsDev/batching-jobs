import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { jobBatch, NewJobBatch } from "@/lib/db/schema"

export async function createBatch(data: NewJobBatch) {
  const res = await db
    .insert(jobBatch)
    .values({
      id: data.id,
      failedJobs: 0,
      name: data.name,
      pendingJobs: data.pendingJobs,
      totalJobs: data.totalJobs,
    })
    .returning({
      id: jobBatch.id,
    })

  return res[0]
}

export async function updateBatch(id: string, data: Partial<NewJobBatch>) {
  try {
    await db.update(jobBatch).set(data).where(eq(jobBatch.id, id))
  } catch (error) {
    console.error(error)
  }
}
