import Image from "next/image";
import Link from "next/link";

import Wallet from "../Wallet";

import ImgLogo from "@/app/assets/logo-x.svg";
import ImgIdo from "./images/icon-ido.png";
import ImgLaunch from "./images/icon-launch.png";
import ImgStake from "./images/icon-stake.png";
import ImgOdyssey from "./images/icon-odyssey.png";

const SUIPAD_DOMAIN = "https://suipad.xyz";

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
    href: "/"
  },
];

function Nav() {
  // const [slide, setSlide] = useState(false);

  return (
    <div className="relative">
      <div className="z-10 hidden items-center gap-10 lg:flex">
        {navs.map(nav => (
          <div className="group relative flex gap-2 text-xl font-semibold" key={nav.text}>
            {nav.icon}
            {nav.href ? <Link href={nav.href}>{nav.text}</Link> : <span>{nav.text}</span>}

            <div className="absolute left-14 top-10 hidden h-1 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#4ec3c9] group-hover:block"></div>
          </div>
        ))}
      </div>
      {/* <div
        className="relative ml-4 flex h-8 w-8 items-center justify-center md:hidden"
        onClick={() => setSlide(!slide)}
      >
        <span
          className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[1.5px] h-[3px] w-[22px] -translate-y-2 rounded-sm bg-white transition-transform"
          style={slide ? { transform: "translateY(0) rotate(45deg)" } : {}}
        />
        <span
          className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[1.5px] h-[3px] w-[22px] rounded-sm bg-white transition-opacity"
          style={slide ? { opacity: 0 } : {}}
        />
        <span
          className="absolute left-1/2 top-1/2 -ml-[11px] -mt-[1.5px] h-[3px] w-[22px] translate-y-2 rounded-sm bg-white transition-transform"
          style={slide ? { transform: "translateY(0) rotate(-45deg)" } : {}}
        />
      </div> */}
    </div>
  );
}

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-20 w-full bg-white/10 backdrop-blur">
      <div className="mx-auto flex h-11 w-[1280px] items-center justify-between md:h-[126px]">
        <Link href={SUIPAD_DOMAIN}>
          <Image className="w-8 md:w-[90px]" src={ImgLogo} alt="logo" />
        </Link>

        <Nav />

        <Wallet />
      </div>
    </header>
  );
}
