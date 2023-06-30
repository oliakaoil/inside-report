"use client";

import React, { FC } from "react";
import AppIcon, { AppIconSize, AppIconType } from "../app-icon";

interface Props {
  className?: string;
  iconSpacing?: string | number;
  label: string;
  icon?: AppIconType;
  iconSize?: AppIconSize;
  onClick?: () => void;
  size?: AppIconSize;
}

const IconLink: FC<Props> = ({
  className = "",
  iconSpacing = 1,
  size = "large",
  label,
  icon,
  iconSize = "large",
  onClick,
}) => {
  const hasIcon = Boolean(icon);
  const labelSize = size === "large" ? "" : "text-sm";
  const smallIcon = ["small", "x-small"].includes(iconSize);

  return (
    <span
      className={`inline-block cursor-pointer text-white hover:opacity-90 ${className}`}
      role="button"
      onClick={() => onClick && onClick()}
    >
      {hasIcon && (
        <AppIcon
          type={icon as AppIconType}
          size={iconSize}
          className={`mr-${iconSpacing} inline-block`}
        />
      )}
      <span
        className={`inline-block ${labelSize} ${
          hasIcon && "leading-[100%] align-middle"
        } ${hasIcon && !smallIcon && "pt-[3px]"}`}
      >
        {label}
      </span>
    </span>
  );
};

export default IconLink;
