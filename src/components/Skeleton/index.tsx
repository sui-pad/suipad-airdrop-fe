import { useMemo } from "react";

import { cva } from "cva";
import { twMerge } from "tailwind-merge";

const skeletonStyle = cva({
  base: "animate-pulse block",
  variants: {
    variant: {
      text: "rounded",
      circular: "rounded-full",
      rounded: "rounded",
    },
    colors: {
      primary: "bg-[#EAEAEB]",
      dark: "bg-[#141414]",
    },
  },
  defaultVariants: { variant: "text", colors: "primary" },
});

export default function Skeleton(props: {
  className?: string;
  variant?: "text" | "circular" | "rounded";
  colors?: "primary" | "dark";
}) {
  const { className, variant, colors } = props;

  const classs = useMemo(() => {
    return twMerge(skeletonStyle({ variant, colors }), className);
  }, [className, variant, colors]);

  return (
    <span className={classs}>
      <span className="inline-block leading-none" />
    </span>
  );
}

export function TextSkeleton(props: {
  className?: string;
  colors?: "primary" | "dark";
  children: React.ReactNode;
  isLoaded: boolean;
}) {
  const { isLoaded, children, ...other } = props;

  if (isLoaded) return children;

  return <Skeleton className={props.className} {...other} />;
}
