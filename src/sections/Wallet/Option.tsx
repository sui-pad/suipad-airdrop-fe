import Image, { StaticImageData } from "next/image";

export interface OptionType {
  name: string;
  icon: StaticImageData;
  connect: () => void;
}

export default function Option(props: OptionType) {
  const { name, icon, connect } = props;

  return (
    <div
      className="flex cursor-pointer items-center gap-x-2 rounded-md border border-[#4EC3C9] p-2 transition-colors hover:bg-[#4EC3C9]/20"
      onClick={connect}
    >
      <Image className="w-8" src={icon} alt={name} />

      {name}
    </div>
  );
}
