import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { account, user } from "@/lib/db/schema"
import { hash } from "@/lib/hash"

export async function getUserByEmail(email: string) {
  const _user = await db.query.user.findFirst({
    where: eq(user.email, email),
  })

  if (!_user) return null

  return _user
}

export async function getAccountByUserId(userId: string) {
  const account = await db.query.account.findFirst({
    where: eq(user.id, userId),
  })

  if (!account) return null

  return account
}

export async function getAccountByEmail(email: string) {
  const _account = await db
    .select()
    .from(account)
    .fullJoin(user, eq(user.id, account.userId))
    .where(eq(user.email, email))
    .limit(1)
    .execute()

  if (!_account?.[0].account) return null

  return _account[0].account
}

export async function verifyCredentials(
  userId: string,
  plainTextPassword: string
) {
  const account = await getAccountByUserId(userId)

  if (!account) {
    return false
  }

  const salt = "salt" // account.salt;
  const savedPassword = account.password

  if (!salt || !savedPassword) {
    return false
  }

  const hashedPassword = await hash(plainTextPassword, salt)

  return account.password == hashedPassword
}
