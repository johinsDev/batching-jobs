import { eq, sql } from "drizzle-orm"

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

// decrease the number of pending jobs by 1

export async function decreasePendingJobs(id: string) {
  console.log("decreasePendingJobs", { id })

  try {
    await db
      .update(jobBatch)
      .set({
        pendingJobs: sql`${jobBatch.pendingJobs} - 1`,
      })
      .where(eq(jobBatch.id, id))
  } catch (error) {
    console.error(error)
  }
}

export async function increaseFailedJobs(id: string) {
  try {
    await db
      .update(jobBatch)
      .set({
        failedJobs: sql`${jobBatch.failedJobs} + 1`,
      })
      .where(eq(jobBatch.id, id))
  } catch (error) {
    console.error(error)
  }
}
