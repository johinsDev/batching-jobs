import { db } from "@/lib/db"
import { server, serverTypeEnum } from "@/lib/db/schema"
import { nanoid } from "@/lib/utils"

export async function createServer() {
  try {
    await db.insert(server).values({
      id: nanoid(),
      name: "server1",
      type: serverTypeEnum[0],
    })
  } catch (error) {
    console.error(error)
  }
}
