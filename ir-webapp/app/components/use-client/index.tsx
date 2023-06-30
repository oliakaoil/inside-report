"use client";

import { FC } from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UseClient: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default UseClient;
