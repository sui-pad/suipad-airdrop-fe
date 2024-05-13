import { useState, useEffect } from "react";

export default function useDevice() {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobileDevice(window.matchMedia("(max-width: 768px)").matches);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobileDevice;
}
