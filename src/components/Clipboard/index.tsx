"use client";

import { useEffect } from "react";

import useClipboard from "./hooks";

export default function Clipboard(props: {
  className?: string
  text: string;
  children?: React.ReactNode;
  callback: () => void;
}) {
  const { className, text, children, callback } = props;
  const { copied, clipboard } = useClipboard();

  useEffect(() => {
    if (copied) callback();
  }, [copied]);

  return <div className={className} onClick={() => clipboard(text)}>{children}</div>;
}
