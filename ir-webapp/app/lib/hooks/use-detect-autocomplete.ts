import { useEffect, useState } from "react";

export default function useDetectAutocomplete<T>(): any {
  const [acEvent, setAcEvent] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (acEvent) {
      setAcEvent(null);
    }
  }, [acEvent]);

  useEffect(() => {
    if (loaded) {
      return;
    }

    setLoaded(true);

    document.addEventListener("onautocomplete", (event: any) => {
      if (event?.target?.hasAttribute("autocompleted")) {
        setAcEvent(event);
      }
    });
  }, [loaded]);

  return acEvent;
}
