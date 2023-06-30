import { useEffect, useState } from "react";

export default function useBrowser<T>(): Boolean {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser;
}
