/** @format */

"use client";

import { FC, useCallback, useEffect, useState } from "react";
import FilingCard from "../filing-card";
import Button from "../button";
import TextInput from "../form/text-input";
import FilingActionSelect from "../filing-action-select";
import { SelectToggleOption } from "../select-toggle-menu";
import { LoadState, scrollToTop, SelectOption } from "app/lib/helpers";
import { IFiling } from "lib/models/filing.model";
import SimpleDateRangeSelect from "../form/simple-date-range-select";
import Pagination from "../pagination";
import IconLink from "../icon-link";
import usePanelController from "app/lib/hooks/use-panel-controller";
import { useSearchParams } from "next/navigation";
import { get } from "app/lib/local-storage";
import {
  FilingPagedResult,
  get as getFilings,
} from "app/lib/controls/filing.control";
import { UserFilingSearch } from "app/lib/controls/user.control";

export type FilingSearchParams = {
  dateFilter: string;
  keyword: string;
  actionFilter: string[];
};

interface Props {
  filings?: IFiling[];
  onSearch?: (params: FilingSearchParams) => void;
}

const DefaultActionFilter = ["buy", "sell"];

const DefaultResults: FilingPagedResult = {
  records: [],
  page: 1,
  perPage: 200,
  total: 0,
  error: "",
  date: new Date(),
  query: {},
};

const FilingList: FC<Props> = ({ filings: preloadFilings, onSearch }) => {
  const searchParams = useSearchParams();

  const [results, setResults] = useState<FilingPagedResult>({
    ...DefaultResults,
    records: preloadFilings || [],
  });
  const [keyword, setKeyword] = useState<string>(
    searchParams.get("keyword") || ""
  );
  const [actionFilter, setActionFilter] =
    useState<string[]>(DefaultActionFilter);
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loadState, setLoadState] = useState<LoadState>("unloaded");
  const [formKey, setFormKey] = useState(0);

  const { open: openPanel, close: closePanel } = usePanelController();

  const preloaded = Boolean(preloadFilings?.length);

  const getDefaultDate = useCallback((): string => "last-5", []);

  const handleActionSelect = (opts: SelectToggleOption[]) => {
    setActionFilter(opts.map(({ id }) => id));
  };

  const handleDateRangeSelect = (opt: SelectOption | null) => {
    setDateFilter(opt?.value || getDefaultDate());
  };

  const handleBumpDate = () => {
    handleDateRangeSelect({ value: "last-60", label: "" });
    handleSearch();
  };

  const handleSearch = (keepPage?: boolean) => {
    if (!keepPage) {
      setPage(1);
    }
    scrollToTop();
    setLoadState("load");
  };

  const handleClickSymbol = ({ meta }: IFiling) => {
    const { symbol } = meta;
    if (symbol) {
      setKeyword(`symbol:${symbol}`);
      setFormKey(formKey + 1);
      handleSearch();
    }
  };

  const handleClickName = ({ meta }: IFiling) => {
    const { name } = meta;
    if (name) {
      setKeyword(`name:${name}`);
      setFormKey(formKey + 1);
      handleSearch();
    }
  };

  const handleChangePage = (page: number) => {
    if (!page) {
      return;
    }
    setPage(page);
    handleSearch(true);
  };

  const getFilingSearch = useCallback(() => {
    return {
      name: keyword,
      keyword,
      actionFilter,
      dateFilter,
    } as UserFilingSearch;
  }, [keyword, actionFilter, dateFilter]);

  const openSavePanel = (withNew?: boolean) => {
    const panelProps = {
      onLoad: handleLoadSavedSearch,
      newFilingSearch: withNew ? getFilingSearch() : undefined,
    };

    openPanel("filing-search", panelProps);
  };

  const handleLoadSavedSearch = ({
    actionFilter,
    dateFilter,
    keyword,
  }: UserFilingSearch) => {
    setKeyword(keyword);
    setActionFilter(actionFilter);
    setDateFilter(dateFilter);
    setFormKey(formKey + 1);
    handleSearch();
    closePanel();
  };

  const handleSymbolSaveSearch = ({ meta }: IFiling) => {
    const { symbol } = meta;
    const panelProps = {
      onLoad: handleLoadSavedSearch,
      newFilingSearch: {
        ...getFilingSearch(),
        name: `${symbol} Recent Filings`,
        keyword: `symbol:${symbol}`,
      },
    };

    openPanel("filing-search", panelProps);
  };

  useEffect(() => {
    if (loadState == "unloaded") {
      setDateFilter(getDefaultDate());
      if (preloaded) {
        setLoadState("loaded");
        return;
      }

      const searchId = searchParams.get("searchId");
      if (searchId) {
        const savedSearches: UserFilingSearch[] =
          get("filing-searches", true) || [];
        const search = savedSearches.find(({ id }) => id === searchId);
        if (search) {
          handleLoadSavedSearch(search);
          return;
        }
      }

      handleSearch();
      return;
    }

    if (loadState !== "load") {
      return;
    }

    setLoadState("loading");

    onSearch && onSearch({ dateFilter, keyword, actionFilter });

    getFilings(page, dateFilter, keyword, actionFilter).then((res) => {
      setResults({ ...res, date: new Date() });
      setLoadState("loaded");
    });
  }, [
    loadState,
    keyword,
    dateFilter,
    actionFilter,
    page,
    preloaded,
    searchParams,
    onSearch,
  ]);

  const {
    records,
    page: resultPage,
    perPage,
    total,
    date: resultDate,
    query,
  } = results;

  const hasSearchSuggestion = query.dateFilter !== "last-60";
  const hasFilings = Boolean(records.length);
  const canSave = loadState === "loaded";

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="w-full mb-3 md:mb-5 pb-2">
          <div className="flex justify-start items-center flex-wrap">
            <div className="mr-0 md:mr-3 w-full md:w-auto mt-2">
              <TextInput
                key={`formkey-ti-${formKey}`}
                onChange={setKeyword}
                placeholder="Search by keyword..."
                defaultValue={keyword}
                onEnterKeyPress={() => handleSearch()}
                className="w-full"
                clearable
              />
            </div>

            <div className="w-auto mr-3 mt-2">
              <FilingActionSelect
                key={`formkey-fas-${formKey}`}
                onChange={handleActionSelect}
                defaultValue={actionFilter}
              />
            </div>
            <div className="mr-3 mt-2">
              <SimpleDateRangeSelect
                key={`formkey-sds-${formKey}`}
                onChange={handleDateRangeSelect}
                value={dateFilter}
              />
            </div>
            <div className="mr-3 mt-2">
              <Button
                onClick={() => handleSearch()}
                size="small"
                label="Search"
                icon="search"
                dots={loadState == "loading"}
              />
            </div>
            <div className="mt-2">
              <Button
                onClick={() => openSavePanel(true)}
                size="small"
                label="Save"
                icon="save-disk"
                color="third"
                disabled={!canSave}
              />
            </div>
          </div>
        </div>
        <div className="w-full overflow-auto grow">
          <div className="w-full">
            {loadState == "loaded" && !hasFilings && (
              <div className="mb-10">
                <div className="mb-4">
                  No filings found
                  {hasSearchSuggestion ? ", try these suggestions:" : "."}
                </div>
                {hasSearchSuggestion && (
                  <Button
                    label="Increase Timeframe"
                    color="third"
                    onClick={() => handleBumpDate()}
                  />
                )}
              </div>
            )}
            <div className="flex justify-start mb-4 pb-2 border-b border-theme-border-gray">
              <Pagination
                key={`results-${resultDate}`}
                page={resultPage}
                perPage={perPage}
                total={total}
                onChange={handleChangePage}
              />
              <div className="flex-grow hidden md:flex justify-end items-center">
                <IconLink
                  label="Saves"
                  icon="save-disk"
                  onClick={() => openSavePanel()}
                />

                <IconLink
                  label="Alerts"
                  icon="notifs"
                  iconSpacing="0"
                  onClick={() => openPanel("alerts")}
                  className="ml-2"
                />
              </div>

              <div className="flex-grow flex md:hidden justify-end items-center">
                <IconLink
                  label=""
                  icon="save-disk"
                  onClick={() => openSavePanel()}
                />

                <IconLink
                  label=""
                  icon="notifs"
                  iconSpacing="0"
                  onClick={() => openPanel("alerts")}
                  className="ml-1"
                />
              </div>
            </div>
            <div className="mb-2">
              {records.map((filing: IFiling) => {
                const { filing_id } = filing;
                return (
                  <div className="mb-5" key={filing_id}>
                    <FilingCard
                      filing={filing}
                      onClickSymbol={handleClickSymbol}
                      onClickName={handleClickName}
                      onSymbolSaveSearch={handleSymbolSaveSearch}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilingList;
