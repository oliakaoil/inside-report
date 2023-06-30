"use client";

import { FC, useState } from "react";
import AppIcon from "../app-icon";
import SidebarLink from "../sidebar-link";
import PlainLink from "../sidebar-link/plain-link";
import Logo from "../logo";
import Panel from "../panel";
import { SidebarLinks } from ".";

interface Props {}

const MobileSidebar: FC<Props> = () => {
  const [hidden, setHidden] = useState(true);

  const handleOpen = () => {
    setHidden(false);
  };

  const handleClose = () => {
    setHidden(true);
  };

  return (
    <>
      <div className="block xl:hidden absolute top-[20px] right-5 md:right-10 z-5">
        <AppIcon
          type="hamburger-menu"
          size="large"
          className="block cursor-pointer"
          color="white"
          onClick={() => handleOpen()}
        />
      </div>

      <Panel isOpen={!hidden} onClose={handleClose} size={250}>
        <div className="w-full h-full bg-theme-bg-black">
          <div className="p-2 w-full h-full box-border flex flex-col justify-start items-start">
            <div
              role="button"
              className="text-white hover:text-white hover:no-underline"
              onClick={() => {
                handleClose();
                window.location.href = "/";
              }}
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
            <div
              className="pb-5 w-full"
              onClick={() => handleClose()}
              role="button"
            >
              {SidebarLinks.map(({ href, id, label, icon }) => (
                <SidebarLink href={href} label={label} icon={icon} key={id} />
              ))}
            </div>
            <div
              className="flex flex-col justify-end w-full grow"
              onClick={() => handleClose()}
              role="button"
            >
              <PlainLink href="/help" label="Help &amp; Feedback" />
              <PlainLink href="/disclaimer" label="Disclaimer" />
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default MobileSidebar;
