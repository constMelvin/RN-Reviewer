import { relations } from "drizzle-orm";
import { index, uuid } from "drizzle-orm/pg-core";
import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	username: text("username").unique(),
	displayUsername: text("display_username"),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const books = pgTable("books", {
	book_id: uuid("book_id").defaultRandom().primaryKey(),
	book_title: text("book_title"),
	book_type: text("book_type"),
	user_id: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	created_at: timestamp().defaultNow(),
	updated_at: timestamp().defaultNow(),
});

export const book_topics = pgTable("book_topics", {
	topic_id: uuid("topic_id").defaultRandom().primaryKey(),
	topics: text("topics").notNull(),
	deadline: text("deadline").notNull(),
	done: boolean("done").default(false),
	links: text("links"),
	book_id: uuid("book_id")
		.notNull()
		.references(() => books.book_id, { onDelete: "cascade" }),
	created_at: timestamp().defaultNow(),
	updated_at: timestamp().defaultNow(),
});

export const book_subtopics = pgTable("book_subtopics", {
	subtopic_id: uuid("subtopic_id").defaultRandom().primaryKey(),
	topic_id: uuid("topic_id")
		.notNull()
		.references(() => book_topics.topic_id, {
			onDelete: "cascade",
		}),
	topics: text("topics").notNull(),
	deadline: text("deadline").notNull(),
	status: text("status").default("Not Started"),
	done: boolean("done").default(false),
	links: text("links"),
});

export const task = pgTable("task", {
	task_id: uuid("task_id").primaryKey().defaultRandom(),
	task_name: text("task_name").notNull(),
	task_date: text("task_date").notNull(),
	task_type: text("task_type").notNull(),
	task_link: text("task_link").notNull(),
	task_isComplete: boolean("task_isComplete").default(false).notNull(),
	user_id: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	created_at: timestamp().defaultNow(),
	updated_at: timestamp().defaultNow(),
});

export const scores = pgTable("score", {
	score_id: uuid("score_id").defaultRandom().primaryKey(),
	subject: text("subject").notNull(),
	score: integer("score").default(0).notNull(),
	score_total: integer("score_total").default(0).notNull(),
});

export const daily_agenda = pgTable(
	"daily_agenda",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		user_id: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		date: text("date").notNull(), // format: 'yyyy-MM-dd' para consistent sa existing mo (task_date is text din)
		is_done: boolean("is_done").default(false).notNull(),
		created_at: timestamp("created_at").defaultNow(),
	},
	(table) => [
		index("daily_agenda_user_date_idx").on(table.user_id, table.date),
	]
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	dailyAgenda: many(daily_agenda),
}));

export const dailyAgendaRelations = relations(daily_agenda, ({ one }) => ({
	user: one(user, {
		fields: [daily_agenda.user_id],
		references: [user.id],
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const booksRelations = relations(books, ({ many }) => ({
	topics: many(book_topics),
}));
export const bookTopicsRelations = relations(book_topics, ({ many, one }) => ({
	subtopics: many(book_subtopics),
	book: one(books, {
		fields: [book_topics.book_id],
		references: [books.book_id],
	}),
}));
export const bookSubtopicsRelations = relations(book_subtopics, ({ one }) => ({
	topic: one(book_topics, {
		fields: [book_subtopics.topic_id],
		references: [book_topics.topic_id],
	}),
}));
