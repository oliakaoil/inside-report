"use client";
import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: any; // @todo Url type from somewhere
  label: String;
}

const PlainLink: FC<Props> = ({ href, label }) => {
  const pathname = usePathname();

  const activeClass =
    pathname === href ? "text-theme-text-white" : "text-theme-text-gray";

  return (
    <Link className={`hover:text-theme-text-white ${activeClass}`} href={href}>
      <span>{label}</span>
    </Link>
  );
};

export default PlainLink;
