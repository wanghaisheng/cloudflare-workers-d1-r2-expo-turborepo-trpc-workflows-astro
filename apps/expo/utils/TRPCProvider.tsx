import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {httpBatchLink} from '@trpc/client';
import React, {useState} from 'react';
import {api} from './api';
import superjson from 'superjson';
import {getBaseUrl} from "@/utils/base-url.tsx";
import {useAuth} from '@clerk/clerk-expo'

export function TRPCProvider({children}: { children: React.ReactNode; }) {
  const { getToken} = useAuth()


  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/trpc`,
          async headers() {
          const token = await getToken()
          return {
            Authorization: token ? `Bearer ${token}` : '',
          }
        },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
}