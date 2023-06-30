/** @format */

"use client";
import { FC } from "react";
import AppIcon, { AppIconType } from "../app-icon";
import { usePathname } from "next/navigation";
import usePanelController from "app/lib/hooks/use-panel-controller";

interface Props {
  href?: string | undefined;
  panelId?: string | undefined;
  label: String;
  icon: AppIconType;
}

const SidebarLink: FC<Props> = ({ panelId, href, label, icon }) => {
  const pathname = usePathname();
  const { open: openPanel } = usePanelController();

  const activeClass =
    pathname === href ? "text-theme-text-white" : "text-theme-text-gray";

  const handleClick = () => {
    if (href) {
      window.location.href = href;
      return;
    }

    if (panelId) {
      openPanel("filing-search");
    }
  };

  return (
    <div
      className={`cursor-pointer flex justify-start items-center w-full box-border pt-3 pb-3 pl-4 text-lg font-bold rounded-lg hover:bg-theme-bg-hover-gray hover:text-theme-text-white hover:no-underline ${activeClass}`}
      onClick={() => handleClick()}
    >
      <div className="pr-2">
        <AppIcon type={icon} />
      </div>
      <div>{label}</div>
    </div>
  );
};

export default SidebarLink;
