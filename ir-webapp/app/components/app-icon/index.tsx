"use client";

import React, { FC } from "react";

import {
  AiOutlineSave,
  AiFillWarning,
  AiFillCheckCircle,
  AiOutlineHome,
  AiOutlineExport,
  AiOutlineDownload,
  AiOutlineLink,
  AiOutlineInfoCircle,
  AiFillInteraction,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineFileSearch,
  AiOutlineStock,
} from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
  BsFillCartFill,
  BsTrash,
} from "react-icons/bs";
import { IoAlertCircleSharp } from "react-icons/io5";
import { TiEdit } from "react-icons/ti";
import {
  MdOutlineExpandMore,
  MdOutlineNotificationAdd,
  MdOutlineNotificationsNone,
} from "react-icons/md";
import { FaHotjar } from "react-icons/fa";

import classnames from "classnames";

export type AppIconType =
  | "alert"
  | "arrow-right-circle"
  | "arrow-left-circle"
  | "cart"
  | "edit-pencil"
  | "expand"
  | "ok"
  | "save-disk"
  | "home"
  | "notifs"
  | "add-notif"
  | "export"
  | "download"
  | "link"
  | "info-circle"
  | "menu-arrow"
  | "connect"
  | "warn"
  | "search"
  | "close"
  | "trash"
  | "hamburger-menu"
  | "file-search"
  | "stock"
  | "hot";

export type AppIconSize =
  | "x-small"
  | "small"
  | "large"
  | "x-large"
  | "xxx-large";

export const AppIconMap: Map<AppIconType, any> = new Map([
  ["alert", IoAlertCircleSharp],
  ["arrow-right-circle", BsFillArrowRightCircleFill],
  ["arrow-left-circle", BsFillArrowLeftCircleFill],
  ["cart", BsFillCartFill],
  ["edit-pencil", TiEdit],
  ["expand", MdOutlineExpandMore],
  ["ok", AiFillCheckCircle],
  ["save-disk", AiOutlineSave],
  ["warn", AiFillWarning],
  ["home", AiOutlineHome],
  ["add-notif", MdOutlineNotificationAdd],
  ["export", AiOutlineExport],
  ["download", AiOutlineDownload],
  ["link", AiOutlineLink],
  ["info-circle", AiOutlineInfoCircle],
  ["menu-arrow", BiChevronDown],
  ["connect", AiFillInteraction],
  ["hamburger-menu", AiOutlineMenu],
  ["search", AiOutlineSearch],
  ["close", AiOutlineClose],
  ["trash", BsTrash],
  ["notifs", MdOutlineNotificationsNone],
  ["file-search", AiOutlineFileSearch],
  ["stock", AiOutlineStock],
  ["hot", FaHotjar],
]);

export type AppIconColor =
  | "black"
  | "blue"
  | "green"
  | "light-yellow"
  | "red"
  | "white";

const TailwindColorMap: Map<AppIconColor, string> = new Map([
  ["black", ""],
  ["blue", "fill-blue-500"],
  ["green", "fill-green-600"],
  ["light-yellow", "fill-amber-50"],
  ["red", "fill-red-500"],
  ["white", "fill-white"],
]);

const ReactIconsSizeMap: Map<AppIconSize, number> = new Map([
  ["x-small", 14],
  ["small", 18],
  ["large", 25],
  ["x-large", 50],
  ["xxx-large", 100],
]);

export interface Props {
  className?: string;
  type: AppIconType;
  active?: () => boolean;
  color?: AppIconColor;
  onClick?: () => void;
  size?: AppIconSize;
  title?: string;
}

const AppIcon: FC<Props> = ({
  className = "",
  type,
  size = "small",
  color = "black",
  active,
  onClick,
  title = "",
}: Props) => {
  const IconComponent = AppIconMap.get(type);

  if (!IconComponent) {
    console.warn("unknown icon", type);
    return null;
  }

  if (active && active()) {
    color = "blue";
  }

  const classNames = classnames(
    "icon",
    type,
    size,
    TailwindColorMap.get(color || "black"),
    className,
    { "cursor-pointer": Boolean(onClick) }
  );

  return (
    <IconComponent
      className={classNames}
      size={ReactIconsSizeMap.get(size)}
      onClick={() => onClick && onClick()}
      title={title}
    />
  );
};

export default AppIcon;
