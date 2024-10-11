import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { account, AccountType } from "@/lib/db/schema"

export const getAccountByUserId = async (
  userId: string,
  accountType: AccountType
) => {
  const data = await db.query.account.findFirst({
    where: and(eq(account.userId, userId), eq(account.providerId, accountType)),
  })

  if (!data) return null

  return data
}
