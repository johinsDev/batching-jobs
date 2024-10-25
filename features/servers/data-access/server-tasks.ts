import { db } from "@/lib/db"
import { NewServerTasks, serverTasks } from "@/lib/db/schema"

export async function createServerTasks(
  data: Array<Omit<NewServerTasks, "id">>
) {
  const res = await db.insert(serverTasks).values(data).returning({
    id: serverTasks.id,
    serverId: serverTasks.serverId,
  })

  return res
}
