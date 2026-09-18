import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categoriesTable = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postsTable = pgTable("posts", {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
        .notNull()
        .references(() => categoriesTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: text("password").notNull(),
    role: varchar("role", { length: 20 }).notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentsTable = pgTable("comments", {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
        .notNull()
        .references(() => postsTable.id, { onDelete: "cascade" }),
    authorName: varchar("author_name", { length: 100 }).notNull().default("Anonim"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
    posts: many(postsTable),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
    category: one(categoriesTable, {
        fields: [postsTable.categoryId],
        references: [categoriesTable.id],
    }),
    comments: many(commentsTable),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
    post: one(postsTable, {
        fields: [commentsTable.postId],
        references: [postsTable.id],
    }),
}));