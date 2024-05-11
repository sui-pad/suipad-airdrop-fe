import { useState } from "react";
import copy from "copy-to-clipboard";

export default function useClipboard() {
  const [copied, setCopied] = useState<boolean>(false);

  function clipboard(text: string) {
    if (copied) return;

    const didCopy = copy(text);

    if (didCopy) {
      setCopied(didCopy);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }

  return { copied, clipboard };
}
