import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { NewServer, server } from "@/lib/db/schema"
import { nanoid } from "@/lib/utils"

export async function createServer(data: Omit<NewServer, "id">) {
  const res = await db
    .insert(server)
    .values({
      id: nanoid(),
      ...data,
    })
    .returning({
      id: server.id,
      type: server.type,
    })

  return res[0]
}

export async function updateServer(
  id: string,
  data: Partial<Omit<NewServer, "id">>
) {
  const res = await db
    .update(server)
    .set(data)
    .where(eq(server.id, id))
    .returning({
      id: server.id,
    })

  return res[0]
}
