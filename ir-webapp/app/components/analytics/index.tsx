"use client";

import React, { FC, useEffect, useState } from "react";
import * as FullStory from "@fullstory/browser";
import useBrowser from "app/lib/hooks/use-browser.hook";
import useAppSettings from "app/lib/hooks/use-app-settings.hook";

interface Props {}

const Analytics: FC<Props> = () => {
  const isBrowser = useBrowser();
  const [fsInit, setFsInit] = useState(false);

  const { isProd, fullStoryOrgId } = useAppSettings();

  useEffect(() => {
    if (isBrowser && isProd && fullStoryOrgId && !fsInit) {
      console.log("fs init", fullStoryOrgId);
      FullStory.init({ orgId: fullStoryOrgId });
      setFsInit(true);
    }
  }, [isBrowser, fullStoryOrgId, isProd]);

  return <></>;
};

export default Analytics;
