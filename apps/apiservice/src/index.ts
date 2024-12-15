// apps/apiservice/src/index.ts
import { appRouter, createContext } from '@acme/trpc';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { D1Database } from '@cloudflare/workers-types';
import { getDB } from "@acme/db";
import type { R2Bucket } from '@cloudflare/workers-types';

interface Env {
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  DB: D1Database;
  IMAGES_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = getDB(env);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Your existing TRPC handler
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: (opts: FetchCreateContextFnOptions) => createContext({
        ...opts,
        clerkPublicKey: env.CLERK_PUBLISHABLE_KEY,
        clerkSecretKey: env.CLERK_SECRET_KEY,
        db,
        imagesBucket: env.IMAGES_BUCKET
      }),
    });
  },
};
