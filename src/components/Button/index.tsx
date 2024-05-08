"use client";

import { useState } from "react";
import { cva } from "cva";
import { twMerge } from "tailwind-merge";

type ButtonType = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const buttonStyle = cva({
  base: "flex items-center justify-center whitespace-nowrap rounded-lg text-white transition-colors duration-300",
  variants: {
    colors: {
      primary: "bg-[#b6b8bc] hover:bg-[#a4a6a8]",
      active: "bg-[#4EC3C9] hover:bg-[#63cacf]",
    },
    disabled: {
      false: "",
      true: "text-[#666] opacity-80 pointer-events-none",
    },
  },
  defaultVariants: {
    colors: "primary",
  },
});

export default function Button(
  props: ButtonType & {
    disabledLoading?: boolean;
    colors?: "primary" | "active";
    onClick?: () => any | Promise<any>;
  },
) {
  const { className, colors, disabled, disabledLoading, children, onClick, ...other } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    if (onClick) {
      setIsLoading(true);

      try {
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button disabled={isDisabled} className={twMerge(buttonStyle({ colors }), className)} onClick={handleClick}>
      {!disabledLoading && isLoading ? <div className="loading w-6" /> : children}
    </button>
  );
}
