import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"

export async function getUserByEmail(email: string) {
  const _user = await db.query.user.findFirst({
    where: eq(user.email, email),
  })

  if (!_user) return null

  return _user
}
