"use client"

import { useSearchParams } from "next/navigation";

import { useEffect, Suspense } from "react";

function Message() {
  const searchParams = useSearchParams();

  const message = searchParams.get("message");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.opener && message) {
      window.opener.postMessage(message, "*");
    }
  }, [message]);

  return <div></div>;
}

export default function Oauth() {
  return (
    <Suspense>
      <Message />
    </Suspense>
  );
}
