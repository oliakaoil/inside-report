import { useContext } from "react";
import { AppSettingsContext, AppSettings } from "app/lib/contexts/app-settings";

const useAppSettings = () => useContext<AppSettings>(AppSettingsContext);

export default useAppSettings;
