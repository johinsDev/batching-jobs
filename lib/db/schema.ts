import { relations } from "drizzle-orm"
import { integer, sqliteTableCreator, text } from "drizzle-orm/sqlite-core"

export const roleTypeEnum = ["user", "admin", "superadmin"] as const

export const accountTypeEnum = ["email", "google", "github"] as const

const sqliteTable = sqliteTableCreator((name) => `app_${name}`)

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 100 }),
  email: text("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash"),
  role: text("role", { length: 50, enum: roleTypeEnum })
    .notNull()
    .default(roleTypeEnum[0]),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
})

export const accounts = sqliteTable("accounts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
  githubId: text("github_id").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  salt: text("salt"),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
})

export const profiles = sqliteTable("profile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  image: text("image"),
  imageBlurData: text("image_blur_data"),
  bio: text("bio").notNull().default(""),
})

export const usersRelations = relations(users, ({ one }) => ({
  accounts: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

// export const sessions = sqliteTable("session", {
//   id: text("id").primaryKey(),
//   userId: integer("user_id", { mode: "number" })
//     .references(() => users.id, {
//       onDelete: "cascade",
//     })
//     .notNull(),
//   expiresAt: integer("expires_at").notNull(),
// });
