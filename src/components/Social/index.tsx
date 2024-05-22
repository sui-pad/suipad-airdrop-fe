import Image from "next/image";

import ImgWebsite from "./images/website.png";
import ImgX from "./images/x.png";
import ImgDiscord from "./images/discord.png";
import ImgGitbook from "./images/gitbook.png";
import ImgMedium from "./images/medium.png";

export interface UrlType {
  website: string;
  twitter: string;
  discord: string;
  gitbook: string;
  medium: string;
}

export default function Social({ urls }: { urls: UrlType }) {
  const { website, twitter, discord, gitbook, medium } = urls;

  return (
    <div className="flex items-center gap-5">
      {website && (
        <a className="w-6 md:w-[30px]" href={website} target="_blank">
          <Image src={ImgWebsite} alt="website" />
        </a>
      )}
      {twitter && (
        <a className="w-6 md:w-[30px]" href={twitter} target="_blank">
          <Image src={ImgX} alt="twitter" />
        </a>
      )}
      {discord && (
        <a className="w-6 md:w-[30px]" href={discord} target="_blank">
          <Image src={ImgDiscord} alt="discord" />
        </a>
      )}
      {gitbook && (
        <a className="w-6 md:w-[30px]" href={gitbook} target="_blank">
          <Image src={ImgGitbook} alt="gitbook" />
        </a>
      )}
      {medium && (
        <a className="w-6 md:w-[30px]" href={medium} target="_blank">
          <Image src={ImgMedium} alt="medium" />
        </a>
      )}
    </div>
  );
}
