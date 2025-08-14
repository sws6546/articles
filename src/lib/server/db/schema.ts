import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const admin = sqliteTable('admin', {
	id: integer('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name').notNull(),
});
