"use client";

import { FC } from "react";
import classnames from "classnames";
import Dots from "../dots";
import AppIcon, { AppIconType } from "../app-icon";

interface Props {
  className?: string;
  color?: "first" | "second" | "third" | "fourth";
  disabled?: boolean;
  dots?: boolean;
  label: string;
  icon?: AppIconType;
  onClick?: () => void;
  size?: "xsmall" | "small" | "large";
}

const ButtonStyles = {
  first: "bg-theme-button-purple text-white",
  firstDots: "text-theme-button-purple",

  second: "bg-indigo-300 text-white",
  secondDots: "text-indigo-300",

  third: "bg-amber-700 text-white",
  thirdDots: "text-amber-700",

  fourth: "bg-green-500 text-white",
  fourthDots: "text-green-700",

  xsmall: "py-1 px-2",
  small: "py-1 px-2 md:py-2 md:px-3",
  large: "py-2 px-3 md:py-3 md:px-5",
};

const LabelStyles = {
  xsmall: "text-sm",
  small: "",
  large: "",
};

const Button: FC<Props> = ({
  className = "",
  color = "first",
  disabled = false,
  dots = false,
  label,
  onClick,
  size = "large",
  icon,
}) => {
  const clickDisabled = disabled || dots;
  const iconEl = icon ? (
    <AppIcon type={icon} className="inline-block mr-1" />
  ) : null;

  return (
    <div
      className={classnames(
        "inline-block rounded-lg font-bold text-center box-border relative",
        ButtonStyles[color],
        ButtonStyles[size],
        className,
        {
          "opacity-40 hover:opacity-40": clickDisabled,
          "cursor-pointer hover:opacity-90": !clickDisabled,
        }
      )}
      onClick={() => !clickDisabled && onClick && onClick()}
    >
      <span
        className={classnames("align-middle", LabelStyles[size], {
          [ButtonStyles[`${color}Dots`]]: dots,
        })}
      >
        {iconEl}
        <span>{label}</span>
      </span>
      {dots && (
        <div className="absolute z-10" style={{ top: 10, left: 0, right: 0 }}>
          <Dots />
        </div>
      )}
    </div>
  );
};

export default Button;
