import { useEffect } from "react";

export const useTimeoutWarning = (active, ms, message) => {
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => message && message(), ms);
    return () => clearTimeout(id);
  }, [active, ms, message]);
}
