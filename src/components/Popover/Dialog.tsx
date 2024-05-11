import Image from "next/image";
import { twMerge } from "tailwind-merge";

import ImgClose from "@/app/assets/close.png";

interface DialogType {
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
}

export function Dialog(props: DialogType) {
  const { open, title, children, onClose } = props;

  return (
    <div
      className={twMerge(
        "invisible fixed left-0 top-0 z-40 flex h-screen w-screen items-center justify-center opacity-0 transition-all",
        open && "visible opacity-100",
      )}
    >
      <div className="fixed left-0 top-0 -z-10 h-screen w-screen bg-black/30" />

      <div className="relative rounded-xl bg-white p-5">
        <div
          className="absolute right-5 top-5 w-6 cursor-pointer opacity-50 transition-opacity hover:opacity-100"
          onClick={onClose}
        >
          <Image src={ImgClose} alt="close" />
        </div>
        {title && <h2 className="mb-5 text-center text-2xl font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
