"use client";

import { SWRConfig } from "swr";

interface SWRProviderProps {
  children: React.ReactNode;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
