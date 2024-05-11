import { useMemo } from "react";

import { cva } from "cva";
import { twMerge } from "tailwind-merge";

const skeletonStyle = cva({
  base: "animate-pulse block",
  variants: {
    variant: {
      text: "rounded w-16 md:w-20",
      circular: "h-5 w-5 rounded-full md:h-10 md:w-10",
      rounded: "rounded h-10 w-20 md:h-20 md:w-40",
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
