import Image from "next/image";

import Button from "@/components/Button";
import ImgLogo from "./images/logo.png";
import ImgCover from "./images/cover.png";

import Tag from "./Tag";

function AirdropBox() {
  return (
    <div className="h-[420px] rounded-xl border border-[#DCDADA] shadow-[0px_5px_16px_0px_rgba(0,0,0,0.08)]">
      <div className="relative">
        <Image src={ImgCover} alt="" />

        <span className="absolute right-4 top-4 flex h-6 w-[100px] items-center justify-center rounded-full bg-[#6DE0E5] text-sm">
          Active
        </span>
      </div>

      <div className="px-4">
        <div className="flex items-end justify-between">
          <div className="relative z-10 -mt-10 w-20 overflow-hidden rounded-lg bg-white p-0.5">
            <Image src={ImgLogo} alt="" />
          </div>

          <Tag tags={["Staking"]} />
        </div>

        <h2 className="mt-7 text-3xl font-bold leading-none">Merlin Starter</h2>
        <p className="mt-4 text-[#5F5F5F]">Merlin Staking & Regularly Interact Dual Incentives.</p>

        <Button className="mx-auto mt-8 h-10 w-64 text-2xl font-bold" colors="active">
          SEE DETAILS
        </Button>
      </div>
    </div>
  );
}

export default function AirdropList() {
  return (
    <div className="grid grid-cols-3 gap-x-[30px]">
      <AirdropBox />
    </div>
  );
}
