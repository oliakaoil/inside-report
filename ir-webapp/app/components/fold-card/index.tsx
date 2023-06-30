import React, { FC, useState } from "react";
import classnames from "classnames";
import AppIcon from "../app-icon";

interface Props {
  open?: boolean;
  disabled?: boolean;
  title: string | JSX.Element | JSX.Element[];
  children: JSX.Element | JSX.Element[];
  bgColor?: FoldCardColor;
}

export type FoldCardColor =
  | "black"
  | "blue"
  | "green"
  | "light-yellow"
  | "red"
  | "white";

const TailwindColorMap: Map<FoldCardColor, string> = new Map([
  ["black", "bg-theme-bg-black"],
  ["blue", "fill-blue-500"],
  ["green", "fill-green-600"],
  ["light-yellow", "fill-amber-50"],
  ["red", "fill-red-500"],
  ["white", "fill-white"],
]);

const FoldCard: FC<Props> = ({
  open: startOpen = false,
  disabled = false,
  title,
  children,
  bgColor = "black",
}) => {
  const [open, setOpen] = useState(startOpen);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const isOpen = disabled || open;

  const contentClassName = classnames("overflow-hidden p-3", {
    "transition-transform": isOpen,
    "-translate-y-full max-h-0 p-0": !isOpen,
  });
  const bgColorClass = TailwindColorMap.get(bgColor);

  return (
    <div
      className={`w-full overflow-hidden border-theme-border-gray border-2 rounded-md ${bgColorClass}`}
    >
      <div
        className={`w-full flex z-10 relative cursor-pointer p-3 ${bgColorClass}`}
        role="button"
        onClick={toggleOpen}
      >
        <div className="w-full">{title}</div>
        <div className="flex-grow flex justify-end">
          {!disabled && (
            <AppIcon
              type="expand"
              color="white"
              className={isOpen ? "rotate-180" : ""}
            />
          )}
        </div>
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default FoldCard;
