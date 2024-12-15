import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { recaps } from "@acme/db";
import { eq } from 'drizzle-orm';

export const recapsRouter = {
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user.userId) return [];
      const userRecaps = await ctx.db
        .select()
        .from(recaps)
        .where(eq(recaps.userId, ctx.user.userId));
      return userRecaps;
    }),
  getById: protectedProcedure
    .input(z.coerce.number().positive())
    .query(async ({ ctx, input }) => {
      if (!ctx.user.userId) return null;
      
      const recap = await ctx.db
        .select()
        .from(recaps)
        .where(eq(recaps.id, input))
        .limit(1);

      if (!recap[0]) return null;

      return recap[0];
    }),
};