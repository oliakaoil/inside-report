"use client";

import { FC } from "react";
import { AppIconType } from "app/components/app-icon";
import SidebarLink from "app/components/sidebar-link";
import PlainLink from "app/components/sidebar-link/plain-link";
import Logo from "app/components/logo";

interface Props {}

export const SidebarLinks: {
  id: string;
  label: string;
  href?: string;
  panelId?: string;
  icon: AppIconType;
}[] = [
  { id: "home", label: "Home", href: "/", icon: "home" },
  {
    id: "most-active",
    label: "Most Active",
    href: "/most-active",
    icon: "hot",
  },
  {
    id: "filings",
    label: "All Filings",
    href: "/filings",
    icon: "file-search",
  },
  {
    id: "saved-search",
    label: "Saved Searches",
    panelId: "filing-search",
    icon: "save-disk",
  },
  { id: "alerts", label: "Alerts", href: "/alerts", icon: "add-notif" },
  {
    id: "downloads",
    label: "Downloads",
    href: "/downloads",
    icon: "download",
  },
  {
    id: "integrations",
    label: "Integrations",
    href: "/integrations",
    icon: "connect",
  },
  { id: "about", label: "About", href: "/about", icon: "info-circle" },
];

const Sidebar: FC<Props> = () => {
  return (
    <div className="h-full fixed bg-theme-bg-black">
      <div className="p-2 w-full h-full box-border flex flex-col justify-start items-start">
        <div
          role="button"
          className="text-white hover:text-white hover:no-underline"
          onClick={() => (window.location.href = "/")}
        >
          <div className="w-full flex justify-start items-center pb-5 pt-4">
            <Logo />
            <div className="pl-2">
              Know when insiders
              <br />
              <span className="font-bold">BUY</span> and{" "}
              <span className="font-bold">SELL</span>
            </div>
          </div>
        </div>
        <div className="pb-5 w-full">
          {SidebarLinks.map(({ href, id, label, icon, panelId }) => (
            <SidebarLink
              href={href}
              label={label}
              icon={icon}
              key={id}
              panelId={panelId}
            />
          ))}
        </div>
        <div className="flex flex-col justify-end w-full grow">
          <PlainLink href="/help" label="Help &amp; Feedback" />
          <PlainLink href="/disclaimer" label="Disclaimer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
