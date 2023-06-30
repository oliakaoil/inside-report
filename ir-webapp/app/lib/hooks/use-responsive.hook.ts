import { useCallback, useEffect, useState } from "react";

type MediaSize = "big" | "med" | "sm";

type MediaData = {
  windowWidth: number;
  size: MediaSize;
};

const getMediaData = (): MediaData => {
  const windowWidth = window.innerWidth;
  let size: MediaSize = "big";

  if (windowWidth <= 1200) {
    size = "med";
  } else if (windowWidth <= 600) {
    size = "sm";
  }

  return { windowWidth, size };
};

export default function useResponsive<T>(): MediaData {
  const [mediaData, setMediaData] = useState<MediaData>(getMediaData());

  const updateMediaData = useCallback(() => {
    setMediaData(getMediaData());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateMediaData);

    return () => window.removeEventListener("resize", updateMediaData);
  }, [updateMediaData]);

  return mediaData;
}
