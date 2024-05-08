import { twMerge } from "tailwind-merge";

interface DialogType {
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
}

export function Dialog(props: DialogType) {
  const { open, title, children } = props;

  return (
    <div
      className={twMerge(
        "invisible fixed left-0 top-0 z-40 flex h-screen w-screen items-center justify-center opacity-0 transition-all",
        open && "visible opacity-100",
      )}
    >
      <div className="fixed left-0 top-0 -z-10 h-screen w-screen bg-black/30" />

      <div className="rounded-xl bg-white p-5">
        {title && <h2 className="mb-5 text-center text-2xl font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
