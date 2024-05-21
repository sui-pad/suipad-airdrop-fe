export default function Tag({ home, tags }: { home?: boolean, tags: { name: string; show: boolean }[] }) {
  return (
    <div className="flex items-center gap-3">
      {tags.map(item => (
        (!home || item.show) && <span
          className="flex h-6 items-center justify-center rounded-md bg-[#DBDBDB] px-4 text-sm"
          key={item.name}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}
