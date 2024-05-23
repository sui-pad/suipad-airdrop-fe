import { Suspense } from "react";

import { Dialog } from "@/components/Popover";

import Option from "./Option";
import Evm from "./Evm";
import Sui from "./Sui";
import { ChainType } from "./index";
import { useWalletDialogStore } from "./hooks";

export default function WalletDialog({ chain }: { chain: ChainType }) {
  const { isOpen, closeDialog } = useWalletDialogStore();

  return (
    <Dialog title="Connect Wallet" open={isOpen} onClose={closeDialog}>
      <Suspense>
        <div className="w-[85vw] md:mx-auto md:w-[360px]">
          <div className="mx-auto grid gap-3">
            {chain === "bsc" && <Evm renderOption={Option} />}
            {chain === "sui" && <Sui renderOption={Option} />}
          </div>
        </div>
      </Suspense>
    </Dialog>
  );
}
