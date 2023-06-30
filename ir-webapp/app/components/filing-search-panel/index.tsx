/** @format */

"use client";

import { LoadState } from "app/lib/helpers";
import { get } from "app/lib/local-storage";
import React, { FC, useEffect, useState } from "react";
import { UserFilingSearch } from "app/lib/controls/user.control";
import FilingSearchCard from "../filing-search-card";
import Panel from "../panel";

interface Props {
  isOpen: boolean;
  newFilingSearch?: UserFilingSearch;
  onClose: () => void;
  onLoad?: (filingSearch: UserFilingSearch) => void;
}

const FilingSearchPanel: FC<Props> = ({
  isOpen,
  onClose,
  onLoad,
  newFilingSearch,
}) => {
  const [searches, setSearches] = useState<UserFilingSearch[]>([]);
  const [hideNew, setHideNew] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("unloaded");

  const load = () => {
    const searches: UserFilingSearch[] = get("filing-searches", true) || [];
    searches.sort((a, b) => {
      const aCreated = a.created || 0;
      const bCreated = b.created || 0;
      if (aCreated === bCreated) {
        return 0;
      }
      return aCreated > bCreated ? -1 : 1;
    });
    setSearches(searches);
    setLoadState("loaded");
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setHideNew(false);
  }, [newFilingSearch]);

  const handleCancelNew = () => {
    setHideNew(true);
  };

  const handleSaveNew = () => {
    setHideNew(true);
    load();
  };

  const handleLoadSearch = (filingSearch: UserFilingSearch) => {
    // not on filing list page? navigate there and put the filing search id in the URL
    if (window.location.pathname !== "/") {
      window.location.href = `/?searchId=${filingSearch.id}`;
    }

    onLoad && onLoad(filingSearch);
  };

  const handleDelete = () => {
    load();
  };

  const loaded = loadState === "loaded";
  const hasNew = Boolean(newFilingSearch);
  const hasSavedSearches = loaded && Boolean(searches.length);

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      header="Filing Searches"
      size={350}
    >
      <div>
        {hasNew && !hideNew && (
          <div className="mb-[60px]">
            <div className="font-bold mb-3 text-white">New Saved Search:</div>
            <FilingSearchCard
              key={JSON.stringify(newFilingSearch)}
              filingSearch={newFilingSearch as UserFilingSearch}
              onCancel={handleCancelNew}
              onSave={handleSaveNew}
            />
          </div>
        )}
        <div>
          <div className="font-bold mb-3 text-white">Saved Searches:</div>
          {!hasSavedSearches && (
            <div className="text-sm">
              You do not have any saved searches yet. Click the "Save" button on
              the <a href="/filings">All Filings</a> page to create a new saved
              search.
            </div>
          )}
          {searches.map((search: UserFilingSearch) => {
            return (
              <div className="mb-2" key={search.id}>
                <FilingSearchCard
                  filingSearch={search}
                  onLoad={handleLoadSearch}
                  onDelete={handleDelete}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
};

export default FilingSearchPanel;
