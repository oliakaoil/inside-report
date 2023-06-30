"use client";
import { FC, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";

interface Props {}

const ReactTooltipWrapper: FC<Props> = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return <>{isMounted && <ReactTooltip />}</>;
};

export default ReactTooltipWrapper;
