"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { WorkspaceProvider } from "@/lib/workspace-store";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } }),
  );
  return (
    <QueryClientProvider client={client}>
      <Tooltip.Provider delayDuration={250}>
        <WorkspaceProvider>
          {children}
          <Toaster />
        </WorkspaceProvider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}
