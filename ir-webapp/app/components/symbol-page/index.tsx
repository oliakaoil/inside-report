/** @format */

"use client";
import { LoadState, SelectOption } from "app/lib/helpers";
import usePanelController from "app/lib/hooks/use-panel-controller";
import {
  FilingSearchMeta,
  getFilingSearchMeta,
} from "app/lib/controls/filing.control";
import { plural } from "lib/helpers";
import { FC, useEffect, useState } from "react";
import Button from "../button";
import Dots from "../dots";
import FilingPeopleTable from "../filing-people-table";
import SimpleDateRangeSelect from "../form/simple-date-range-select";
import PageHeader from "../page-header";

interface Props {
  symbol: string;
}

const getBlurb = (dateFilter: string, meta: FilingSearchMeta) => {
  let date = "";
  const { count, people } = meta;

  switch (dateFilter) {
    case "today":
      date = "24 hours";
      break;
    case "last-5":
      date = "5 days";
      break;
    case "last-10":
      date = "10 days";
      break;
    case "last-60":
      date = "60 days";
      break;
  }

  let netDerivativeAmount = 0;
  let netNonDerivativeAmount = 0;
  people.forEach(({ nonDerivativeAmount, derivativeAmount }) => {
    netDerivativeAmount += derivativeAmount;
    netNonDerivativeAmount += nonDerivativeAmount;
  });

  let sharePhrase = "";
  if (netNonDerivativeAmount) {
    const action = netNonDerivativeAmount > 0 ? "acquisition" : "disposition";
    sharePhrase = `There was a net non-derivative ${action} of ${Number(
      Math.abs(netNonDerivativeAmount)
    ).toLocaleString()} shares.`;
  }

  let amountPhrase = "";
  if (netDerivativeAmount) {
    const action = netDerivativeAmount > 0 ? "acquisition" : "disposition";
    amountPhrase = `There was a net derivative ${action} of $${Number(
      Math.abs(netDerivativeAmount)
    ).toLocaleString()}.`;
  }

  return `In the past ${date} there ${
    count == 1 ? "was" : "were"
  } ${count} ${plural("filing", count)} from ${people.length} ${plural(
    "party",
    people.length
  )}.${[sharePhrase, amountPhrase].join(" ")}`;
};

const SymbolPage: FC<Props> = ({ symbol }) => {
  const [loadState, setLoadState] = useState<LoadState>("load");
  const [meta, setMeta] = useState<FilingSearchMeta>({ count: 0, people: [] });
  const [dateFilter, setDateFilter] = useState("last-10");

  const { open: openPanel } = usePanelController();

  const handleSearch = () => {
    setLoadState("load");
  };

  const handleViewFilings = () => {
    window.location.href = `/filings?keyword=symbol:${symbol}`;
  };

  const handleDateRangeSelect = (opt: SelectOption | null) => {
    setDateFilter(opt?.value || "last-10");
    handleSearch();
  };

  useEffect(() => {
    if (loadState !== "load") {
      return;
    }
    setLoadState("loading");
    getFilingSearchMeta(dateFilter, symbol, [
      "buy",
      "sell",
      "non-action",
      "unknowm",
    ]).then((res) => {
      setMeta(res);
      setLoadState("loaded");
    });
  }, [loadState, dateFilter]);

  const loaded = loadState === "loaded";

  const blurb = loaded ? getBlurb(dateFilter, meta) : "";

  console.log(meta);

  return (
    <>
      <PageHeader title={symbol}>
        <div className="ml-6">
          <SimpleDateRangeSelect
            onChange={handleDateRangeSelect}
            value={dateFilter}
            size="small"
          />
        </div>
      </PageHeader>
      {!loaded && (
        <div className="inline-block">
          <Dots />
        </div>
      )}
      {loaded && (
        <div className="w-full lg:w-1/2">
          <div className="flex mb-6">
            <div className="w-full">{blurb}</div>
          </div>
          <div className="flex mb-8">
            <div className="w-full flex gap-4">
              <Button
                label="View Filings"
                icon="file-search"
                size="small"
                onClick={handleViewFilings}
              />
              <Button
                label="Get Alerts"
                icon="add-notif"
                size="small"
                onClick={() => openPanel("alerts")}
              />
            </div>
          </div>

          <div className="flex mb-4">
            <div className="w-full">
              {Boolean(meta.people.length) && (
                <FilingPeopleTable people={meta.people} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SymbolPage;
