"use client"

import { SWRConfig } from "swr";

import Header from "@/sections/Header";
import Background from "@/sections/Background";

import Web3Provider from "@/context/eth";

import request, { OptionsType } from "@/utils/request";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SWRConfig
    value={{
      fetcher: (args: [string, OptionsType]) => request(...args),
      revalidateOnFocus: false,
    }}
  >
    <Web3Provider>
      <Header />
      <Background />

      <div className="pt-[166px] pb-[120px]">
        {children}
      </div>
    </Web3Provider>
  </SWRConfig>
}
