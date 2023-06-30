/** @format */

"use client";

import React, { FC } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import useBrowser from "app/lib/hooks/use-browser.hook";
import AppIcon from "../app-icon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
  header?: string;
  size?: number;
}

const getSafePanelWidth = (size?: number) => {
  let safeSize = size;

  // https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
  const viewportWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );

  if (viewportWidth && safeSize) {
    safeSize = Math.min(safeSize, viewportWidth - 10);
  }

  return safeSize;
};

const Panel: FC<Props> = ({ isOpen, onClose, children, header, size }) => {
  const isBrowser = useBrowser();

  if (!isBrowser) {
    return null;
  }

  const hasHeader = Boolean(header);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      overlayOpacity={0}
      size={getSafePanelWidth(size)}
    >
      <div className="bg-theme-bg-black p-3 h-full w-full">
        {hasHeader && (
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-500 border-solid">
            <div className="text-xl text-white font-bold">{header}</div>
            <div className="flex-grow flex justify-end">
              <AppIcon
                type="close"
                onClick={() => onClose()}
                className="cursor-pointer"
              />
            </div>
          </div>
        )}
        {children}
      </div>
    </Drawer>
  );
};

export default Panel;
