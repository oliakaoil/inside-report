"use client";

import { FC, useState } from "react";
import classnames from "classnames";

import AppIcon from "app/components/app-icon";
import FilingActionBlock from "app/components/filing-action-block";
import { IFiling } from "lib/models/filing.model";
import FilingHelper from "app/lib/filing-helper";
import usePanelController from "app/lib/hooks/use-panel-controller";

interface Props {
  filing: IFiling;
  onClickSymbol?: (filing: IFiling) => void;
  onClickName?: (filing: IFiling) => void;
  onSymbolSaveSearch: (filing: IFiling) => void;
  disableSave?: boolean;
  disableAlert?: boolean;
}

const FilingCard: FC<Props> = ({
  filing,
  onClickSymbol,
  onClickName,
  onSymbolSaveSearch,
  disableSave = false,
  disableAlert = false,
}: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const { open: openPanel } = usePanelController();

  const handleShowDetails = () => {
    const updatedShowDetails = !showDetails;
    setShowDetails(updatedShowDetails);
  };

  const filingHelper = FilingHelper(filing);

  const { meta, url = "" } = filing;
  const { symbol, issuer, early_date, net_action, extra_symbols } = meta;

  const hasSymbol = Boolean(symbol) && symbol !== "no-symbol";
  const hasClickSymbol = Boolean(onClickSymbol);
  const hasClickName = Boolean(onClickName);

  const symbolLinks = hasSymbol
    ? [
        {
          href: `https://www.marketwatch.com/investing/stock/${symbol}`,
          title: "MarketWatch",
        },
        // {
        //   href: `https://finance.yahoo.com/quote/${symbol}`,
        //   title: "Yahoo Finance",
        // },
        {
          href: `https://seekingalpha.com/symbol/${symbol}`,
          title: "Seeking Alpha",
        },
      ]
    : [];

  const { derivative, non_derivative } = filingHelper.getNetAmounts();
  return (
    <div className="w-full border border-theme-border-gray rounded-md">
      <div className="flex justify-start items-start h-full py-3 box-border">
        <div className="w-2/12 md:w-1/12 mr-4">
          <FilingActionBlock
            action={net_action}
            date={filingHelper.getTimeSince()}
          />
        </div>

        <div className="flex flex-col w-9/12 md:w-5/12">
          <div>
            <span
              onClick={() =>
                hasSymbol && onClickSymbol && onClickSymbol(filing)
              }
              className={classnames("text-2xl", {
                "cursor-pointer": hasSymbol && hasClickSymbol,
              })}
            >
              {hasSymbol ? symbol : "N/A"}
            </span>
          </div>
          <div className="text-sm text-theme-text-gray">{issuer}</div>

          <div
            className={classnames("md:hidden mb-2 text-sm", {
              "cursor-pointer": hasClickName,
            })}
            onClick={() => onClickName && onClickName(filing)}
          >
            {filingHelper.getNiceName()} &middot;{" "}
            <span className="text-theme-text-gray text-sm">
              {filingHelper.getNiceRelationship()}
            </span>
          </div>

          <div className="mt-2 flex">
            {!disableAlert && (
              <AppIcon
                type="add-notif"
                size="large"
                title={`Get alerts for ${symbol}`}
                onClick={() => {
                  openPanel("alerts");
                }}
              />
            )}
            {!disableSave && (
              <AppIcon
                className="ml-2"
                type="save-disk"
                size="large"
                title={`Save search for ${symbol}`}
                onClick={() => onSymbolSaveSearch(filing)}
              />
            )}
            <AppIcon
              className="ml-2"
              type="stock"
              size="large"
              title={`View recent activity for ${symbol}`}
              onClick={() => {
                window.location.href = `/s/${symbol}`;
              }}
            />
          </div>
        </div>

        <div className="hidden md:block w-4/12 flex flex-col">
          <div
            className={classnames("mb-2", { "cursor-pointer": hasClickName })}
            onClick={() => onClickName && onClickName(filing)}
          >
            {filingHelper.getNiceName()}
          </div>
          <div className="text-sm text-theme-text-gray">
            {filingHelper.getNiceRelationship()}
          </div>
        </div>

        <div className="pr-2 w-1/12 md:pr-4 md:w-2/12 flex justify-end items-start box-border">
          <div
            className="cursor-pointer flex"
            role="button"
            onClick={() => handleShowDetails()}
          >
            <div className="mr-1">Details</div>
            <AppIcon type="expand" size="small" />
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="flex items-top justify-start mt-3 py-4 box-border border-t border-theme-border-gray">
          <div className="w-1/12 min-w-1/12 mr-4 hidden md:block"></div>
          <div className="w-5/12 mx-3 md:mx-0">
            <DetailLabel>Date Posted</DetailLabel>
            <div className="text-sm">{filingHelper.getPostedDate()}</div>

            <DetailLabel className="mt-2">Net Derivatives</DetailLabel>
            <div className="text-sm">
              Acquired: {Number(derivative.acquired).toLocaleString()}{" "}
              <span className="hidden md:inline-block">&nbsp;|&nbsp;</span>
              <br className="md:hidden" /> Disposed:{" "}
              {Number(derivative.disposed).toLocaleString()}
            </div>

            <DetailLabel className="mt-2">Net Non-Derivatives:</DetailLabel>
            <div className="text-sm">
              Acquired: {Number(non_derivative.acquired).toLocaleString()}{" "}
              <span className="hidden md:inline-block">&nbsp;|&nbsp;</span>
              <br className="md:hidden" />
              Disposed: {Number(non_derivative.disposed).toLocaleString()}
            </div>

            <DetailLabel className="mt-2">Links</DetailLabel>
            {symbolLinks.map(({ href, title }) => (
              <a
                href={href}
                target="_blank"
                className="inline-block mr-3 hover:opacity-90"
                key={href}
              >
                <AppIcon
                  type="link"
                  size="x-small"
                  className="inline-block mr-1"
                />
                <span className="text-sm inline-block">{title}</span>
              </a>
            ))}
          </div>
          <div className="w-5/12 md:w-4/12">
            <DetailLabel>Earliest Transaction Date</DetailLabel>
            <div className="text-sm">{early_date}</div>

            <DetailLabel className="mt-2">SEC Form 4:</DetailLabel>
            <div className="text-sm">
              <a href={url} target="_blank">
                <AppIcon
                  type="link"
                  size="x-small"
                  className="inline-block mr-1"
                />
                <span className="inline-block text-xs md:text-sm">
                  {filingHelper.getShortFilingId()}
                </span>
              </a>
            </div>

            <DetailLabel className="mt-2">Additional Tickers</DetailLabel>
            <div className="text-sm">
              <span className="inline-block text-sm">
                {extra_symbols.length ? (
                  extra_symbols.join(",")
                ) : (
                  <span className="italic">none</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetaiLabelProps {
  className?: string;
  children: React.ReactNode;
}

const DetailLabel: FC<DetaiLabelProps> = ({ children, className = "" }) => {
  return (
    <div className={`text-sm md:text-base font-bold ${className}`}>
      {children}
    </div>
  );
};

export default FilingCard;
