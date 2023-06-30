"use client";

import { FC, useEffect, useState } from "react";
import { getTopFilings, TopFiling } from "app/lib/controls/filing.control";
import { LoadState, scrollToTop } from "app/lib/helpers";
import FilingActionSelect from "../filing-action-select";
import { SelectToggleOption } from "../select-toggle-menu";
import Row from "./row";
import Dots from "../dots";

interface Props {
  topFilings?: { date: number; filings: TopFiling[] };
}

interface HeaderProps {
  label: string;
  width?: number;
  align?: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({
  label,
  width = 2,
  align = "left",
  className = "",
}) => {
  return (
    <div
      className={`font-bold capitalize w-${width}/12 text-${align} ${className} text-sm md:text-base`}
    >
      {label}
    </div>
  );
};

const headers = [
  { id: "symbol", label: "company", width: 3 },
  { id: "spacer", label: "", width: 1 },
  { id: "net", label: "", width: 1, className: "hidden md:block" },
  { id: "count", label: "count", align: "center", width: 2 },
  { id: "weight", label: "weight", align: "center", width: 3 },
  { id: "last", label: "last filing", align: "center", width: 4 },
];

const DefaultActionFilter = ["buy", "sell"];

const TopFilings: FC<Props> = ({ topFilings: preloadTopFilings }) => {
  const [actionFilter, setActionFilter] =
    useState<string[]>(DefaultActionFilter);
  const [loadState, setLoadState] = useState<LoadState>(
    preloadTopFilings ? "loaded" : "load"
  );
  const [topFilings, setTopFilings] = useState<{
    date: number;
    filings: TopFiling[];
  }>(preloadTopFilings || { date: 0, filings: [] });

  const handleActionSelect = (opts: SelectToggleOption[]) => {
    setActionFilter(opts.map(({ id }) => id));
    handleSearch();
  };

  const handleSearch = () => {
    scrollToTop();
    setLoadState("load");
  };

  useEffect(() => {
    if (loadState !== "load") {
      return;
    }
    setLoadState("loading");
    getTopFilings(actionFilter).then((response) => {
      setLoadState("loaded");
      setTopFilings(response);
    });
  }, [loadState, actionFilter]);

  const { filings } = topFilings;
  const loading = loadState === "loading";

  return (
    <div>
      <div className="mb-4 flex justify-start items-center">
        <FilingActionSelect onChange={handleActionSelect} />
        <div className="inline-block ml-2">{loading && <Dots />}</div>
      </div>
      <div className="flex mb-4">
        {headers.map(({ id, label, width, align, className }) => (
          <Header
            label={label}
            key={id}
            width={width}
            align={align}
            className={className}
          />
        ))}
      </div>
      <div>
        {filings.map((topFiling) => {
          return <Row topFiling={topFiling} key={topFiling.symbol} />;
        })}
      </div>
    </div>
  );
};

export default TopFilings;
