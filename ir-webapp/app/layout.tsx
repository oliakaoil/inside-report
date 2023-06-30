import "./globals.scss";
import Sidebar from "app/components/sidebar";
import MobileSidebar from "app/components/sidebar/mobile-sidebar";
import { ToastContainer } from "app/components/toast";
import Analytics from "app/components/analytics";
import { AppSettingsProvider } from "app/lib/contexts/app-settings";
import { PanelControllerProvider } from "app/lib/contexts/panel-controller";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <head />
      <body>
        <AppSettingsProvider>
          <PanelControllerProvider>
            <div className="flex justify-start items-start w-full h-full">
              <div className="w-2/12 hidden xl:block">
                <Sidebar />
              </div>
              <main className="w-full xl:w-10/12 box-border xl:ml-2 p-4 xl:p-6 h-full grow overflow-auto">
                {children}
              </main>
            </div>
            <MobileSidebar />
            <ToastContainer />
            <Analytics />
          </PanelControllerProvider>
        </AppSettingsProvider>
      </body>
    </html>
  );
}
