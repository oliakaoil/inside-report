import { IFiling } from "lib/models/filing.model";
import { PagedResult } from "../helpers";

export type FilingPagedResult = PagedResult & {
  records: IFiling[];
};

export type TopFiling = {
  weight: number;
  symbol: string;
  issuer: string;
  filingCount: number;
  mostRecentTimestamp: number;
  buys: number;
  sells: number;
};

export type IIssue = {
  symbol: string;
  currency: string;
  exchange: string;
  shares: number;
  market_cap: number;
  last_price: number;
  fifty_day_average: number;
  two_hundred_day_average: number;
  ten_day_average_volume: number;
  three_month_average_volume: number;
  year_high: number;
  year_low: number;
  year_change: number;
  created_at: Date;
  deleted: boolean;
};

export type FilingPerson = {
  name: string;
  relationship: string;
  buys: number;
  sells: number;
  derivativeAmount: number;
  nonDerivativeAmount: number;
};

export type FilingSearchMeta = {
  count: number;
  people: FilingPerson[];
};

export const get = (
  page: number,
  dateFilter: string,
  keyword: string,
  actionFilter: string[]
): Promise<FilingPagedResult> => {
  return fetch(
    `/api/filings?page=${page}&date=${dateFilter}&keyword=${keyword}&actions=${encodeURIComponent(
      actionFilter.join(",")
    )}`
  ).then((res) => res.json());
};

export const getTopFilings = (
  actionFilter?: String[]
): Promise<{
  date: number;
  filings: TopFiling[];
}> => {
  return fetch(
    `/api/filings/top?actions=${(actionFilter || []).join(",")}`
  ).then((res) => res.json());
};

export const getFilingSearchMeta = (
  dateFilter: string,
  keyword: string,
  actionFilter: string[]
) => {
  return fetch(
    `/api/filings/meta?date=${dateFilter}&keyword=${keyword}&actions=${encodeURIComponent(
      actionFilter.join(",")
    )}`
  ).then((res) => res.json());
};
