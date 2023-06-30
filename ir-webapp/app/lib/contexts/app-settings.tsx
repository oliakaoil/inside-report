"use client";

import React, {
  ReactNode,
  FC,
  createContext,
  useState,
  useEffect,
} from "react";

type AppEnvironment = "unknown" | "local" | "prod";

export interface AppSettings {
  fullStoryOrgId: string;
  environment: AppEnvironment;
  isProd: boolean;
}

export const AppSettingsContext = createContext<AppSettings>({
  environment: "local",
  fullStoryOrgId: "",
  isProd: false,
});

interface Props {
  children: ReactNode;
}

export const AppSettingsProvider: FC<Props> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    environment: "unknown",
    fullStoryOrgId: "",
    isProd: false,
  });

  useEffect(() => {
    const environment = (process.env.NEXT_PUBLIC_NODE_ENV ||
      "local") as AppEnvironment;
    setSettings({
      environment,
      fullStoryOrgId: process.env.NEXT_PUBLIC_FULLSTORY_ORG_ID || "",
      isProd: process.env.NEXT_PUBLIC_NODE_ENV === "prod",
    });
    console.log("environment", environment);
  }, []);

  return (
    <AppSettingsContext.Provider value={settings}>
      {children}
    </AppSettingsContext.Provider>
  );
};
