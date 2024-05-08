import React, { useEffect, useState, useRef } from "react";

import { cva } from "cva";
import { twMerge } from "tailwind-merge";

import show from "./show";

interface MessageType {
  open?: boolean;
  status?: "succ" | "warn" | "error";
  tips?: React.ReactNode;
  delay?: number;
  onClose?: () => void;
}

const messageStyle = cva({
  base: "flex justify-center min-h-10 text-xl max-w-[340px] min-w-[200px] max-w-content px-3 py-2 scale-0 bg-white transition-transform",
  variants: {
    show: {
      false: null,
      true: "scale-100",
    },
  },
});

export function Message(props: MessageType) {
  const { open, onClose, delay = 2000, tips } = props;

  const [show, setShow] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout>();

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (open) setShow(open);

    if (open && delay) {
      timer.current = setTimeout(() => {
        handleClose();
      }, delay);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open, delay]);

  return (
    <div className="pt-safe pointer-events-none fixed top-24 z-50 flex w-full justify-center">
      <div className={twMerge(messageStyle({ show }))}>
        <span className="break-words">{tips}</span>
      </div>
    </div>
  );
}

export function showTips(tips?: React.ReactNode, delay?: number) {
  return show(<Message open tips={tips} />, delay);
}

export function showSucc(tips?: React.ReactNode, delay?: number) {
  return show(<Message open status="succ" tips={tips} />, delay);
}

export function showWarn(tips?: React.ReactNode, delay?: number) {
  return show(<Message open status="warn" tips={tips} />, delay);
}

export function showError(tips?: React.ReactNode, delay?: number) {
  return show(<Message open status="error" tips={tips} />, delay);
}

export default Message;
