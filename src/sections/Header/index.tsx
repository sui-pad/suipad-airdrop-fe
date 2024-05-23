import Image from "next/image";
import Link from "next/link";

import Wallet from "../Wallet";
import Nav, { SUIPAD_DOMAIN } from "./Nav";

import ImgLogo from "@/app/assets/logo-x.svg";

export default function Header(props: { wallet?: React.ReactNode }) {
  return (
    <header className="fixed left-0 top-0 z-20 w-full bg-white/10 backdrop-blur">
      <div className="mx-auto flex h-20 w-full items-center px-3 md:h-[126px] md:w-[1280px]">
        <Link href={SUIPAD_DOMAIN}>
          <Image className="w-16 md:w-[90px]" src={ImgLogo} alt="logo" />
        </Link>

        <div className="flex flex-1 flex-row-reverse items-center gap-3 md:flex-row md:gap-0">
          <Nav />
          {props.wallet ?? <div className="w-32 md:w-48" />}
        </div>
      </div>
    </header>
  );
}
