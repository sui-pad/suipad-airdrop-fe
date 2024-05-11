"use client";

import { useEffect } from "react";

import useClipboard from "./hooks";

export default function Clipboard(props: {
  text: string;
  children?: React.ReactNode;
  callback: () => void;
}) {
  const { text, children, callback } = props;
  const { copied, clipboard } = useClipboard();

  useEffect(() => {
    if (copied) callback();
  }, [copied]);

  return <div onClick={() => clipboard(text)}>{children}</div>;
}
