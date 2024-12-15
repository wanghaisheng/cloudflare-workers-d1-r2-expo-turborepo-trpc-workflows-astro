import type {AuthObject} from '@clerk/backend';
import type {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import type { DrizzleDB }from "@acme/db";
import type { R2Bucket } from '@cloudflare/workers-types';

export interface CustomContext {
  req: FetchCreateContextFnOptions['req'];
  resHeaders: FetchCreateContextFnOptions['resHeaders'];
  user: AuthObject | null;
  db: DrizzleDB;
  imagesBucket: R2Bucket;
}

export interface CustomContextOptions {
  clerkSecretKey: string;
  clerkPublicKey: string;
  db: DrizzleDB;
  imagesBucket: R2Bucket;
}
