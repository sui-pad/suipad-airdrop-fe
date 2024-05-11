"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

import { cva } from "cva";
import { twMerge } from "tailwind-merge";

import show from "./show";

import ImgSuccess from "@/app/assets/success.png";

interface MessageType {
  open?: boolean;
  status?: "succ" | "warn" | "error";
  tips?: React.ReactNode;
  delay?: number;
  onClose?: () => void;
}

export function Message(props: MessageType) {
  const { open, status, onClose, delay = 2000, tips } = props;

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

  let icon = null;

  if (status === "succ")
    icon = (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4ec3c9]">
        <Image className="w-4" src={ImgSuccess} alt="success" />
      </div>
    );

  return (
    <div className="pointer-events-none fixed top-24 z-50 flex w-full justify-center">
      <div
        className={twMerge(
          "max-w-content flex min-h-10 max-w-[340px] scale-0 items-center justify-center gap-x-2 rounded-lg bg-white px-5 py-2 shadow-[0_6px_12px_0_rgba(0,0,0,0.1)] transition-transform",
          show && "scale-100",
        )}
      >
        {icon}
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
