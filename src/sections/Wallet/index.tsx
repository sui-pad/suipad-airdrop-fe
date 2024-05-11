"use client";

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";

import { eagerlyConnect } from "@/connection/eth";
import { formatAddress } from "@/utils/formatAddress";

import WalletDialog from "./WalletDialog";
import { ConnectionState, useWalletStore, useWalletDialogStore } from "./hooks";

export default function Wallet() {
  const [show, setShow] = useState<boolean>();
  const { address, connectionState } = useWalletStore();
  const { openDialog } = useWalletDialogStore();

  useEffect(() => {
    eagerlyConnect();
  }, [])

  if (connectionState === ConnectionState.CONNECTED) {
    return (
      <div className="relative">
        <Button
          className="h-14 w-48 bg-white text-xl font-bold text-black shadow-[0_6px_12px_0_rgba(0,0,0,0.06)] hover:bg-[#f7f7f7]"
          onClick={() => setShow(true)}
        >
          {formatAddress({ address })}
        </Button>

        {show && <div
          className="fixed left-0 top-0 h-screen w-screen opacity-0"
          onClick={() => setShow(false)}
        />}

        <div
          className={twMerge(
            "invisible absolute top-full z-10 mt-8 w-full opacity-0",
            show && "visible mt-3 opacity-100",
          )}
        >
          <Button className="h-12 w-full bg-white text-lg text-black shadow-[0_6px_12px_0_rgba(0,0,0,0.06)] hover:bg-[#f7f7f7]">
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button className="h-14 w-48 text-xl font-bold" onClick={openDialog}>
        Connect Wallet
      </Button>
      <WalletDialog  />
    </div>
  );
}
