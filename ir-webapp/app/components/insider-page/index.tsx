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
  insider: string;
}

const InsiderPage: FC<Props> = ({ insider }) => {
  const [loadState, setLoadState] = useState<LoadState>("load");
  const [meta, setMeta] = useState<FilingSearchMeta>({ count: 0, people: [] });
  const [dateFilter, setDateFilter] = useState("last-10");

  const { open: openPanel } = usePanelController();

  const handleSearch = () => {
    setLoadState("load");
  };

  const handleViewFilings = () => {
    window.location.href = `/filings?keyword=insider:${insider}`;
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
    getFilingSearchMeta(dateFilter, insider, [
      "buy",
      "sell",
      "non-action",
      "unknowm",
    ]).then((res) => {
      setMeta(res);
      setLoadState("loaded");
    });
  }, [loadState, dateFilter, insider]);

  const loaded = loadState === "loaded";

  const blurb = ""; //loaded ? getBlurb(dateFilter, meta) : "";

  return (
    <>
      <PageHeader title={insider}>
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

export default InsiderPage;
