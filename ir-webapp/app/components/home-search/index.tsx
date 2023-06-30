"use client";

import { FC, useState } from "react";
import Button from "../button";
import TextInput from "../form/text-input";
import { get } from "app/lib/controls/ident.control";
import startCase from "lodash/startCase";
import { LoadState } from "app/lib/helpers";

interface Props {}

const HomeSearch: FC<Props> = () => {
  const [keyword, setKeyword] = useState("");
  const [searchOptions, setSearchOptions] = useState<
    { title: string; href: string }[]
  >([]);
  const [loadState, setLoadState] = useState<LoadState>("unloaded");

  const handleSearch = () => {
    setSearchOptions([]);
    setLoadState("loading");
    get(keyword).then(({ idents }) => {
      console.log(idents);

      if (!idents.length) {
        setLoadState("loaded");
        return;
      }

      if (idents.length === 1) {
        const { type, name } = idents[0];

        switch (type) {
          case "symbol":
            window.location.href = `/s/${name}`;
            return;
          case "insider":
            window.location.href = `/i/${name}`;
            return;
        }
      }

      setLoadState("loaded");

      setSearchOptions(
        idents.map(({ type, name }) => {
          switch (type) {
            case "symbol":
              return {
                title: name,
                href: `/s/${encodeURIComponent(name.toUpperCase())}`,
              };
              break;

            case "insider":
              const nameParts = name.split(" ");
              const lastName = nameParts.shift();
              return {
                title: startCase(
                  `${nameParts.join(" ")} ${lastName}`.toLowerCase()
                ),
                href: `/i/${encodeURIComponent(name)}`,
              };
              break;
          }
        })
      );
    });
  };

  const handleBack = () => {
    setSearchOptions([]);
    setLoadState("unloaded");
  };

  const hasSearchOptions = Boolean(searchOptions.length);
  const hasMoreResults = hasSearchOptions && searchOptions.length > 20;
  const noSearchMatch = loadState === "loaded" && !hasSearchOptions;

  return (
    <div className="w-full pt-[15%] flex justify-center content-start">
      {hasSearchOptions && (
        <div className="md:w-2/3 w-full flex flex-col justify-center items-center mt-5">
          <div className="mb-3 text-lg">
            There were multiple results that matched your search. Please choose
            one:
          </div>
          {searchOptions.map(({ title, href }) => (
            <div className="mt-2" key={title + href}>
              <a href={href}>{title}</a>
            </div>
          ))}
          {hasMoreResults && (
            <div className="mt-2 text-sm">
              <span className="font-bold">hint:</span> only showing the first 20
              results
            </div>
          )}

          <div className="mt-8">
            <Button
              label="Back"
              icon="arrow-left-circle"
              size="small"
              onClick={handleBack}
            />
          </div>
        </div>
      )}

      {!hasSearchOptions && (
        <div className="md:w-2/3 w-full flex flex-col justify-center items-center">
          <div className="w-full pb-[60px]">
            <div className="w-full text-center text-4xl white pb-5">
              Get Email Alerts for SEC Form 4 filings
            </div>
            <div className="w-full text-center text-xl white">
              Know when insiders buy and sell
            </div>
          </div>

          <div className="w-full md:w-2/3 block md:flex gap-4">
            <div className="flex-grow">
              <TextInput
                onChange={setKeyword}
                placeholder="Search by symbol, company, or insider"
                defaultValue={keyword}
                onEnterKeyPress={() => handleSearch()}
                className="w-full"
                clearable
                autoFocus
              />
            </div>

            <Button
              label="Search"
              icon="search"
              size="small"
              onClick={handleSearch}
              className="mt-4 w-full md:mt-0 md:w-auto"
              dots={loadState === "loading"}
            />
          </div>

          {noSearchMatch && (
            <div className="w-full md:w-2/3 block text-center mt-4">
              There were no results found. Please try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
