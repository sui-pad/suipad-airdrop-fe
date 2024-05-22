export default function Tag({
  home,
  tags,
}: {
  home?: boolean;
  tags: { name: string; show: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {tags.map(
        item =>
          (!home || item.show) && (
            <span
              className="flex h-5 items-center justify-center text-nowrap rounded-md bg-[#DBDBDB] px-2 text-[10px] md:h-6 md:px-4 md:text-sm"
              key={item.name}
            >
              {item.name}
            </span>
          ),
      )}
    </div>
  );
}
