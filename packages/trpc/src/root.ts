import {createTRPCRouter } from './trpc';
import { postRouter } from './router/post';
import { momentsRouter } from './router/moments';
import { recapsRouter } from './router/recaps';
import { userRouter } from './router/user';

export const appRouter = createTRPCRouter({
  post: postRouter,
  moments: momentsRouter,
  recaps: recapsRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;