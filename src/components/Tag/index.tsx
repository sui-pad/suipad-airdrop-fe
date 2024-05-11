export default function Tag({ tags }: { tags: string[] }) {
  return (
    <div className="flex items-center gap-3">
      {tags.map(item => (
        <span
          className="flex h-6 items-center justify-center rounded-md bg-[#DBDBDB] px-4 text-sm"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
