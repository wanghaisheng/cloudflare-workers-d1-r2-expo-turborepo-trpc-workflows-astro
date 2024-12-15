import { moments, userMeta } from "@acme/db";
import { eq, gte, desc, and } from 'drizzle-orm';

import {protectedProcedure} from "../trpc";
import { z } from "zod";

const getPacificTime = (date: Date = new Date()) => {
    return new Date(
        date.toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles'
        })
    );
};

// Helper function to get start of day in PT
const getStartOfDayPT = () => {
    const nowPT = getPacificTime();
    const startOfDay = new Date(nowPT);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
};

export const momentsRouter = {
  add: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx}) => {
      const { userId } = ctx.user;
      if (!userId) return {success: false};
      
      const nowPT = getPacificTime();

      // Insert moment first
      await ctx.db.insert(moments).values({ 
        text: input, 
        userId, 
        createdAt: nowPT
      });
      
      // Then update user meta
      await ctx.db.update(userMeta)
        .set({ lastRecapAt: nowPT })
        .where(eq(userMeta.userId, userId));
      
      return { success: true };
    }),
  getAll: protectedProcedure
    .query(
      async ({ ctx }) => {
        if (!ctx.user.userId) return [];
        
        const startOfToday = getStartOfDayPT();
        
        const userMoments = await ctx.db
          .select()
          .from(moments)
          .where(
            and(
              eq(moments.userId, ctx.user.userId),
              gte(moments.createdAt, startOfToday)
            )
          )
          .orderBy(desc(moments.createdAt));
          
        return userMoments;
      })
}