import { relations } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const roleTypeEnum = ["user", "admin", "superadmin"] as const

export const accountTypeEnum = ["email", "google", "github"] as const

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", {
    mode: "boolean",
  }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  }).notNull(),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
})

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }),
  password: text("password"),
})

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
})

export const usersRelations = relations(user, ({ one, many }) => ({
  accounts: one(account, {
    fields: [user.id],
    references: [account.userId],
  }),
  sessions: many(session),
}))

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export type Account = typeof account.$inferSelect
export type NewAccount = typeof account.$inferInsert

export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert

export type Verification = typeof verification.$inferSelect
export type NewVerification = typeof verification.$inferInsert

export type RoleType = (typeof roleTypeEnum)[number]
export type AccountType = (typeof accountTypeEnum)[number]
