"use client";

import { useState } from "react";

import { cva } from "cva";
import { twMerge } from "tailwind-merge";

type ButtonBaseType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface ButtonType extends ButtonBaseType {
  loadingClass?: string;
  disabledLoading?: boolean;
  colors?: "primary" | "secondary" | "active";
  onClick?: () => any | Promise<any>;
}

const buttonStyle = cva({
  base: "flex items-center justify-center whitespace-nowrap rounded-lg transition-colors duration-300 select-none",
  variants: {
    colors: {
      primary: "bg-[#b6b8bc] text-white hover:bg-[#a4a6a8]",
      secondary: "bg-[#edf9f9] text-[#4ec3c9] hover:bg-[#d9f2f2]",
      active: "bg-[#4ec3c9] text-white hover:bg-[#63cacf]",
    },
    disabled: {
      false: "",
      true: "bg-[#dadbdd] text-white pointer-events-none",
    },
  },
  defaultVariants: {
    colors: "primary",
  },
});

export default function Button(props: ButtonType) {
  const {
    className,
    loadingClass,
    colors,
    disabled,
    disabledLoading,
    children,
    onClick,
    ...other
  } = props;

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
    <button
      disabled={isDisabled}
      className={twMerge(buttonStyle({ colors, disabled }), className)}
      onClick={handleClick}
    >
      {!disabledLoading && isLoading ? (
        <div className={twMerge("loading w-6", loadingClass)} />
      ) : (
        children
      )}
    </button>
  );
}
