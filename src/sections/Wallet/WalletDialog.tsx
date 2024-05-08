import Image from "next/image";
import { Dialog } from "@/components/Popover";

import Evm, { EvmConnection } from "./Evm";
import { useWalletDialogStore } from "./hooks";

function Option(props: EvmConnection) {
  const { name, icon, connect } = props;

  return (
    <div
      className="flex cursor-pointer items-center gap-x-2 rounded-md border border-[#4EC3C9] p-2 transition-colors hover:bg-[#4EC3C9]/20"
      onClick={connect}
      key={name}
    >
      <Image className="w-8" src={icon} alt={name} />

      {name}
    </div>
  );
}

export default function WalletDialog() {
  const { isOpen } = useWalletDialogStore();

  return (
    <Dialog open={isOpen} title="Connect Wallet">
      <div className="w-[360px]">
        <div className="mx-auto grid gap-3">
          <Evm renderOption={Option} />
        </div>
      </div>
    </Dialog>
  );
}
