import { cva } from "cva";
import { twMerge } from "tailwind-merge";

const dividerStyle = cva({
  base: "border-color-[#F0F0F0]",
  variants: {
    direction: {
      column: "border-r",
      row: "border-t",
    },
  },
  defaultVariants: {
    direction: "row",
  },
});

export default function Divider(props: { className?: string; direction?: "column" | "row" }) {
  const { className, direction } = props;

  return <div className={twMerge(dividerStyle({ direction }), className)} />;
}
