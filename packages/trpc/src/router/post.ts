import { moments } from "@acme/db";

import {protectedProcedure, publicProcedure} from "../trpc";
import { z } from "zod";

export const postRouter = {
  all: publicProcedure
    .input(z.string())
    .query(({ input}) => {
    return { id: 1, title: input };
  }),
  private: protectedProcedure
    .input(z.string())
    .query(({ input}) => {
      return { id: 1, title: input };
    }),
  db: protectedProcedure
    .query(async ({ ctx}) => {

      const allMoments = await ctx.db.select().from(moments).all();
      if (!allMoments.length) { return [{"id": 19999, "title": "No moments"}]; }

      return allMoments;
    }),
}
