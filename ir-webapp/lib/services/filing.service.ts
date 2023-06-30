/** @format */

import FilingDB, {
  IFiling,
  NonDerivative,
  Derivative,
} from "lib/models/filing.model";
import SearchLogDb, { ISearchLog } from "lib/models/search-log.model";
import { muxIdProp } from "lib/database";
import { getLastMarketDate } from "lib/helpers";
import subDays from "date-fns/subDays";
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { isMarketDay, ObjectHash } from "lib/helpers";
import { findBySymbol, findBySymbols } from "./issue.service";
import { find as findIdent, Ident } from "./ident.service";

type PagedResult = {
  records: any[];
  page: number;
  perPage: number;
  total: number;
  error: string;
  query: ObjectHash;
};

type FilingPagedResult = PagedResult & {
  records: IFiling[];
};

type TopFiling = {
  weight: number;
  symbol: string;
  issuer: string;
  filingCount: number;
  mostRecentTimestamp: number;
  buys: number;
  sells: number;
};

export const find = async (
  keyword?: string,
  actionFilter?: string[],
  dateFilter?: string,
  page?: number
): Promise<FilingPagedResult> => {
  const perPage = 200;
  page = page || 1;

  const response: FilingPagedResult = {
    records: [],
    page,
    perPage,
    total: 0,
    error: "",
    query: { keyword, actionFilter, dateFilter },
  };

  const where = await getSearchClause(keyword, actionFilter, dateFilter);

  try {
    const query = FilingDB.find(where);

    response.total = await query.clone().count();

    const result = await query
      .skip(Math.max((page - 1) * perPage, 0))
      .limit(perPage)
      .sort({ last_modified: -1 })
      .lean()
      .exec();

    await logSearch(where, response.total, keyword);

    response.records = muxIdProp(result) as IFiling[];
    return response;
  } catch (err) {
    console.error(err);
    response.error = String(err);
    return response;
  }
};

type FilingPerson = {
  name: String;
  relationship: Number;
  sells: number;
  buys: number;
  derivativeAmount: number;
  nonDerivativeAmount: number;
};

type FilingSearchMeta = {
  count: number;
  people: FilingPerson[];
  ident: Ident;
};

export const getMeta = async (
  keyword?: string,
  actionFilter?: string[],
  dateFilter?: string
): Promise<FilingSearchMeta | { error?: string }> => {
  const where = await getSearchClause(keyword, actionFilter, dateFilter);
  const response: {
    count: number;
    people: FilingPerson[];
    error?: string;
    ident: Ident;
  } = { count: 0, people: [] };

  response.ident = await findIdent(keyword);

  try {
    const query = FilingDB.find(where);

    const result = await query
      .select({
        meta: {
          name: 1,
          relationship: 1,
          derivatives: 1,
          non_derivatives: 1,
          net_action: 1,
        },
      })
      .lean()
      .exec();

    const people: Map<string, FilingPerson> = new Map();

    result.forEach(({ meta }) => {
      const { name, relationship, net_action, non_derivatives, derivatives } =
        meta;
      response.count += 1;

      const personKey = name + relationship;
      let person = people.get(personKey);
      if (!person) {
        person = {
          name,
          relationship,
          buys: 0,
          sells: 0,
          derivativeAmount: 0,
          nonDerivativeAmount: 0,
        };
      }

      if (net_action === "buy") {
        person.buys += 1;
      }

      if (net_action === "sell") {
        person.sells += 1;
      }

      if (net_action === "both") {
        person.buys += 1;
        person.sells += 1;
      }

      non_derivatives.forEach(({ amount, action }: NonDerivative) => {
        if (amount) {
          if (action === "D") {
            (person as FilingPerson).nonDerivativeAmount -= amount;
          }
          if (action === "A") {
            (person as FilingPerson).nonDerivativeAmount += amount;
          }
        }
      });

      derivatives.forEach(
        ({ amount_acquired, amount_disposed }: Derivative) => {
          if (amount_disposed) {
            (person as FilingPerson).derivativeAmount -= amount_disposed;
          }

          if (amount_acquired) {
            (person as FilingPerson).derivativeAmount += amount_acquired;
          }
        }
      );

      people.set(personKey, person);
    });

    response.people = Array.from(people).map(([key, val]) => val);

    return response;
  } catch (err) {
    console.error(err);
    response.error = String(err);
    return response;
  }
};

export const getTopFilings = async (
  actionFilter?: string[]
): Promise<{
  date: number;
  filings: TopFiling[];
}> => {
  const date = getStartOfDayTimestamp(
    utcToZonedTime(getLastMarketDate(), "America/New_York")
  );

  const where: ObjectHash = { last_modified: { $gte: date } };

  if (actionFilter?.length) {
    const finalActionFilter = [...actionFilter];
    if (
      finalActionFilter.includes("buy") ||
      finalActionFilter.includes("sell")
    ) {
      finalActionFilter.push("both");
    }

    where["meta.net_action"] = { $in: finalActionFilter };
  }

  const query = FilingDB.find(where);
  const result = await query.lean().exec();

  const filings = muxIdProp(result) as IFiling[];

  const symbols = new Set(filings.map(({ meta }) => meta.symbol));

  const issues = await findBySymbols(Array.from(symbols));

  const filingsBySymbol: { [index: string]: TopFiling } = {};

  filings.forEach((filing) => {
    const { last_modified, meta } = filing;
    const { symbol, derivatives, non_derivatives, net_action, issuer } = meta;
    const issue = issues.find(
      ({ symbol: issueSymbol }) => issueSymbol === symbol
    );

    if (!issue) {
      // @todo log the missing issue
      return;
    }

    const { market_cap, shares, last_price } = issue || {};

    if (last_price < 8) {
      return;
    }

    if (!filingsBySymbol[symbol]) {
      filingsBySymbol[symbol] = {
        weight: 0,
        symbol,
        issuer,
        filingCount: 0,
        mostRecentTimestamp: 0,
        buys: 0,
        sells: 0,
      };
    }

    const topFiling = filingsBySymbol[symbol];

    topFiling.filingCount += 1;
    if (last_modified > topFiling.mostRecentTimestamp) {
      topFiling.mostRecentTimestamp = last_modified;
    }

    switch (net_action) {
      case "buy":
        topFiling.buys += 1;
        break;
      case "sell":
        topFiling.sells += 1;
        break;
      case "both":
        topFiling.buys += 1;
        topFiling.sells += 1;
        break;
    }

    if (market_cap && shares) {
      const { market_cap, shares } = issue;

      non_derivatives.forEach(({ amount }: NonDerivative) => {
        if (amount) {
          topFiling.weight += amount / shares;
        }
      });

      derivatives.forEach(
        ({ title, amount_acquired, amount_disposed }: Derivative) => {
          // amount can be compared to market cap, shares can be compared to float
          const isStock = String(title).toLowerCase().includes("stock");
          const factor = isStock ? shares : market_cap;

          if (amount_disposed) {
            topFiling.weight += amount_disposed / factor;
          }

          if (amount_acquired) {
            topFiling.weight += amount_acquired / factor;
          }
        }
      );
    }
  });

  const topFilings = Object.keys(filingsBySymbol).map((symbol) => {
    const topFiling = filingsBySymbol[symbol];
    return topFiling;
  });

  topFilings.sort((aFiling, bFiling) => {
    const aOneSided = !aFiling.buys || !aFiling.sells;
    const bOneSided = !bFiling.buys || !bFiling.sells;

    if (aOneSided && !bOneSided) {
      return -1;
    }

    if (!aOneSided && bOneSided) {
      return 1;
    }

    const aWeight = aFiling.weight;
    const bWeight = bFiling.weight;
    if (aWeight === bWeight) {
      return 0;
    }
    return aWeight > bWeight ? -1 : 1;
  });

  return { date, filings: topFilings.slice(0, 8) };
};

const getTimestampFromSimpleDate = (sdate: string): number => {
  let date = utcToZonedTime(getLastMarketDate(), "America/New_York");

  switch (sdate) {
    default:
    case "today":
      break;

    case "last-5":
    case "last-10":
    case "last-60":
      const maxDaysBack = Number(sdate.split("-").pop());

      let marketDaysBack = 0;
      do {
        date = subDays(date, 1);

        if (isMarketDay(date)) {
          marketDaysBack += 1;
        }
      } while (marketDaysBack < maxDaysBack);

      break;
  }

  return getStartOfDayTimestamp(date);
};

const getStartOfDayTimestamp = (date: Date) =>
  Math.floor(
    parseISO(`${format(date, "yyyy-MM-dd")}T00:00:00Z`).getTime() / 1000
  );

const addKeywordClause = async (keyword: string) => {
  const kwparts = keyword.split(":");

  // search single field using macro syntax
  if (kwparts.length === 2) {
    const fieldId = kwparts[0].trim().toLowerCase();
    const fieldValue = kwparts[1].trim();

    // exact symbol match
    if (fieldId === "symbol") {
      return { "meta.symbol": fieldValue.toUpperCase() };
    }

    // case-insensitive name of buyer/seller match
    if (fieldId === "name") {
      return { "meta.name": new RegExp(fieldValue, "i") };
    }
  }

  // keyword is symbol? exact match
  const issue = await findBySymbol(keyword);

  if (issue) {
    return { "meta.symbol": issue.symbol.toUpperCase() };
  }

  // general search
  const keywordRe = new RegExp(`.*${keyword}.*`, "i");

  return {
    $or: [
      { "meta.symbol": { $regex: keywordRe } },
      { "meta.name": { $regex: keywordRe } },
      { "meta.issuer": { $regex: keywordRe } },
    ],
  };
};

const logSearch = async (
  query: ObjectHash,
  total: number,
  keyword?: string
): Promise<ISearchLog | null> => {
  if (!keyword) {
    return null;
  }
  return SearchLogDb.create({
    keyword,
    query: JSON.stringify(query),
    total,
    last_modified: Date.now(),
  });
};

const getSearchClause = async (
  keyword?: string,
  actionFilter?: string[],
  dateFilter?: string
): Promise<ObjectHash> => {
  const where: { $and: any } = {
    $and: [{ $or: [{ deleted: false }, { deleted: { $exists: 0 } }] }],
  };

  if (keyword) {
    const kwClause = await addKeywordClause(keyword);
    where.$and.push(kwClause);
  }

  if (actionFilter?.length) {
    const finalActionFilter = [...actionFilter];
    if (
      finalActionFilter.includes("buy") ||
      finalActionFilter.includes("sell")
    ) {
      finalActionFilter.push("both");
    }

    where.$and.push({
      "meta.net_action": { $in: finalActionFilter },
    });
  }

  if (dateFilter) {
    where.$and.push({
      last_modified: { $gte: getTimestampFromSimpleDate(dateFilter) },
    });
  }

  return where;
};
