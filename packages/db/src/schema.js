"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMeta = exports.recaps = exports.moments = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.moments = (0, sqlite_core_1.sqliteTable)('moments', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.text)('userId').notNull(),
    createdAt: (0, sqlite_core_1.integer)({ mode: 'timestamp' }).notNull(),
    text: (0, sqlite_core_1.text)('text').notNull(),
});
exports.recaps = (0, sqlite_core_1.sqliteTable)('recaps', {
    id: (0, sqlite_core_1.integer)('id').primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.text)('userId').notNull(),
    text: (0, sqlite_core_1.text)('text').notNull(),
    createdAt: (0, sqlite_core_1.integer)({ mode: 'timestamp' }).notNull(),
    type: (0, sqlite_core_1.text)('type').$type().notNull(),
    imageId: (0, sqlite_core_1.text)('imageId'),
});
exports.userMeta = (0, sqlite_core_1.sqliteTable)('userMeta', {
    userId: (0, sqlite_core_1.text)('userId').primaryKey(),
    email: (0, sqlite_core_1.text)('email').notNull(),
    createdAt: (0, sqlite_core_1.integer)({ mode: 'timestamp' }).notNull(),
    timezone: (0, sqlite_core_1.text)('timezone').default('America/Los_Angeles').notNull(),
    lastRecapAt: (0, sqlite_core_1.integer)({ mode: 'timestamp' }),
    artStyle: (0, sqlite_core_1.text)('artStyle').$type().default('classical painting').notNull(),
});
