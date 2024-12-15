import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const moments = sqliteTable('moments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  text: text('text').notNull(),
  
});


type RecapType = 'daily' | 'weekly' | 'monthly';

export const recaps = sqliteTable('recaps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),
  text: text('text').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  type: text('type').$type<RecapType>().notNull(),
  imageId: text('imageId'),
});

type ArtStyle = 'classical painting' | 'ethereal animated fairy' | 'childrens book' | '3d animated style';

export const userMeta = sqliteTable('userMeta', {
  userId: text('userId').primaryKey(),
  email: text('email').notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  timezone: text('timezone').default('America/Los_Angeles').notNull(),
  lastRecapAt: integer({ mode: 'timestamp' }),
  artStyle: text('artStyle').$type<ArtStyle>().default('classical painting').notNull(),
});


