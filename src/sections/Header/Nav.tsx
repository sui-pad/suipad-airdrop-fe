// "use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import ImgIdo from "./images/icon-ido.png";
import ImgLaunch from "./images/icon-launch.png";
import ImgStake from "./images/icon-stake.png";
import ImgOdyssey from "./images/icon-odyssey.png";
import { twMerge } from "tailwind-merge";
import useDevice from "@/hooks/useDevice";

export const SUIPAD_DOMAIN = "https://suipad.xyz";

const navs = [
  {
    icon: <Image className="w-7" src={ImgIdo} alt="IDO" />,
    text: "IDO",
    href: SUIPAD_DOMAIN + "/ido/upcoming",
  },
  {
    icon: <Image className="w-7" src={ImgLaunch} alt="Launch" />,
    text: "Launch",
    href: "https://forms.gle/dg5oEanyUqNrtP1L9",
  },
  {
    icon: <Image className="w-7" src={ImgStake} alt="Stake" />,
    text: "Stake",
    href: SUIPAD_DOMAIN + "/staking",
  },
  {
    icon: <Image className="w-7" src={ImgOdyssey} alt="Odyssey" />,
    text: "Odyssey",
    href: "/",
  },
];

export default function Nav() {
  const isMobile = useDevice();
  const [slide, setSlide] = useState(false);

  return (
    <div className="md:flex-1">
      <div
        className={twMerge(
          "flex gap-10 md:items-center md:justify-center",
          isMobile
            ? slide
              ? "fixed left-0 top-0 -z-10 h-screen w-screen flex-col bg-white p-10 pt-28"
              : "hidden"
            : "",
        )}
      >
        {navs.map(nav => (
          <div className="group relative flex gap-2 text-xl font-semibold" key={nav.text}>
            {nav.icon}
            {nav.href ? <Link href={nav.href}>{nav.text}</Link> : <span>{nav.text}</span>}

            <div className="absolute left-14 top-10 hidden h-1 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#4ec3c9] group-hover:block"></div>
          </div>
        ))}
      </div>
      <div
        className="relative flex h-8 w-8 items-center justify-center md:hidden"
        onClick={() => setSlide(!slide)}
      >
        <span
          className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[1.5px] h-[3px] w-[22px] -translate-y-2 rounded-sm bg-[#4ec3c9] transition-transform"
          style={slide ? { transform: "translateY(0) rotate(45deg)" } : {}}
        />
        <span
          className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[1.5px] h-[3px] w-[22px] rounded-sm bg-[#4ec3c9] transition-opacity"
          style={slide ? { opacity: 0 } : {}}
        />
        <span
          className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[1.5px] h-[3px] w-[22px] translate-y-2 rounded-sm bg-[#4ec3c9] transition-transform"
          style={slide ? { transform: "translateY(0) rotate(-45deg)" } : {}}
        />
      </div>
    </div>
  );
}
