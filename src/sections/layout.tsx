"use client"

import { SWRConfig } from "swr";

import Background from "@/sections/Background";

import EvnProvider from "@/context/eth";
import SuiProvider from "@/context/sui";

import request, { OptionsType } from "@/utils/request";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SWRConfig
    value={{
      fetcher: (args: [string, OptionsType, any[]]) => {
        const [url, options, deps] = args;

        if (!deps || deps.every(Boolean)) {
          return request(url, options)
        }

        return false
      },
      revalidateOnFocus: false,
    }}
  >
    <EvnProvider>
      <SuiProvider>
        <Background />
        {children}
      </SuiProvider>
    </EvnProvider>
  </SWRConfig>
}
