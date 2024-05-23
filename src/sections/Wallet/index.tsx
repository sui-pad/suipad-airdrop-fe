"use client";

import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { cx } from "cva";

import Button from "@/components/Button";

import { formatAddress } from "@/utils/formatAddress";

import WalletDialog from "./WalletDialog";
import { ConnectionState, useWalletStore, useWalletDialogStore } from "./hooks";

import ImgBsc from "./images/ChainBsc.png";
import ImgSui from "./images/ChainSui.png";

export type ChainType = "sui" | "bsc";

export default function Wallet(props: { chain: ChainType }) {
  const [show, setShow] = useState<"selectChain" | "disconnect" | null>(null);
  const { address, connectionState, walletDisconnect } = useWalletStore();
  const { openDialog } = useWalletDialogStore();

  const handleDisconnect = async () => {
    setShow(null);
    walletDisconnect();
  };

  let child = (
    <>
      <Button
        className="h-10 w-32 font-bold md:h-14 md:w-48 md:text-xl"
        onClick={() => setShow("selectChain")}
      >
        Connect Wallet
      </Button>

      {show === "selectChain" && (
        <div
          className="fixed left-0 top-0 h-screen w-screen opacity-0"
          onClick={() => setShow(null)}
        />
      )}

      <div
        className={twMerge(
          "invisible absolute right-0 top-full z-10 mt-8 w-[220px] rounded-lg bg-white py-2 opacity-0 shadow-[0_6px_12px_0_rgba(0,0,0,0.06)]",
          show === "selectChain" && "visible mt-3 opacity-100",
        )}
      >
        <div className={cx(props.chain !== "sui" && "cursor-not-allowed")}>
          <div
            className={twMerge(
              "flex h-10 w-full cursor-pointer items-center gap-x-2 px-4 text-black hover:bg-[#f7f7f7] md:h-12 md:text-lg",
              props.chain !== "sui" && "pointer-events-none opacity-80",
            )}
            onClick={openDialog}
          >
            <Image className="w-8" src={ImgSui} alt="bsc" />
            <span>Sui Chain</span>
          </div>
        </div>

        <div className={cx(props.chain !== "bsc" && "cursor-not-allowed")}>
          <div
            className={twMerge(
              "flex h-10 w-full cursor-pointer items-center gap-x-2 px-4 text-black hover:bg-[#f7f7f7] md:h-12 md:text-lg",
              props.chain !== "bsc" && "pointer-events-none opacity-50",
            )}
            onClick={openDialog}
          >
            <Image className="w-8" src={ImgBsc} alt="bsc" />
            <span>BNB Smart Chain</span>
          </div>
        </div>
      </div>
    </>
  );

  if (connectionState === ConnectionState.CONNECTED)
    child = (
      <>
        <Button
          className="h-10 w-36 bg-white font-bold text-black shadow-[0_6px_12px_0_rgba(0,0,0,0.06)] hover:bg-[#f7f7f7] md:h-14 md:w-48 md:text-xl"
          onClick={() => setShow("disconnect")}
        >
          {formatAddress({ address })}
        </Button>

        {show === "disconnect" && (
          <div
            className="fixed left-0 top-0 h-screen w-screen opacity-0"
            onClick={() => setShow(null)}
          />
        )}

        <div
          className={twMerge(
            "invisible absolute top-full z-10 mt-8 w-full opacity-0",
            show === "disconnect" && "visible mt-3 opacity-100",
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

      <WalletDialog {...props} />
    </div>
  );
}
