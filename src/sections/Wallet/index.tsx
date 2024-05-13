"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";

import { formatAddress } from "@/utils/formatAddress";

import WalletDialog from "./WalletDialog";
import { ConnectionState, useWalletStore, useWalletDialogStore } from "./hooks";

export default function Wallet() {
  const [show, setShow] = useState<boolean>();
  const { address, connectionState, walletDisconnect } = useWalletStore();
  const { openDialog } = useWalletDialogStore();

  const handleDisconnect = async () => {
    setShow(false);
    walletDisconnect();
  };

  let child = (
    <Button className="h-10 w-32 font-bold md:h-14 md:w-48 md:text-xl" onClick={openDialog}>
      Connect Wallet
    </Button>
  );

  if (connectionState === ConnectionState.CONNECTED)
    child = (
      <>
        <Button
          className="h-10 w-36 bg-white font-bold text-black shadow-[0_6px_12px_0_rgba(0,0,0,0.06)] hover:bg-[#f7f7f7] md:h-14 md:w-48 md:text-xl"
          onClick={() => setShow(true)}
        >
          {formatAddress({ address })}
        </Button>

        {show && (
          <div
            className="fixed left-0 top-0 h-screen w-screen opacity-0"
            onClick={() => setShow(false)}
          />
        )}

        <div
          className={twMerge(
            "invisible absolute top-full z-10 mt-8 w-full opacity-0",
            show && "visible mt-3 opacity-100",
          )}
        >
          <Button
            className="h-10 w-full bg-white text-black shadow-[0_6px_12px_0_rgba(0,0,0,0.06)] hover:bg-[#f7f7f7] md:h-12 md:text-lg"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      </>
    );

  return (
    <div className="relative">
      {child}
      <WalletDialog />
    </div>
  );
}
