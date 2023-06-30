/** @format */

import util from "util";
import {
  intervalToDuration,
  formatDuration,
  format as DateFnsFormat,
  isValid,
  parseISO,
  toDate,
  sub,
} from "date-fns";
import parseDuration from "parse-duration";
import pluralize from "pluralize";

export type ObjectHash = { [index: string]: any };

export const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

export const parseDateWithSlashes = (
  date: string
): { month: string; day: string; year: string } => {
  const [month, day, year] = String(date)
    .split("/")
    .map((val: string) => val.padStart(2, "0"));

  return {
    month,
    day,
    year,
  };
};

export const formatPrice = (val: number | string): string => {
  const local = Number(val).toLocaleString();
  const [int, dec] = local.split(".");

  if (!dec) {
    return int;
  }

  return `${int}.${dec.padEnd(2, "0")}`;
};

export const formatDate = (
  val: string | number | Date,
  format: any
): string => {
  let dateISO = null;

  if (typeof val === "number") {
    dateISO = toDate(String(val).length === 10 ? val * 1000 : val);
  } else if (typeof val === "string") {
    dateISO = val ? parseISO(val) : null;
  } else {
    dateISO = val;
  }

  if (!dateISO || !isValid(dateISO)) {
    return "";
  }

  return DateFnsFormat(dateISO, format);
};

export const getNiceDuration = (durationVal: string | Interval) => {
  let durationObj;

  if (typeof durationVal === "string") {
    const ms = parseDuration(durationVal, "ms");
    durationObj = intervalToDuration({ start: 0, end: ms });
  } else {
    durationObj = intervalToDuration(durationVal);
  }

  if (!durationObj) {
    return "";
  }

  return formatDuration(durationObj, { format: ["hours", "minutes"] });
};

export const plural = (str: string, count?: number): string =>
  pluralize(str, count || 0);

export const debug = (o: any) =>
  console.log(
    util.inspect(o, { showHidden: false, depth: null, colors: true })
  );

export const getLastMarketDate = (): Date => {
  let date = new Date();
  const dow = DateFnsFormat(new Date(), "E").toLowerCase();

  if (["sat", "sun"].includes(dow)) {
    date = sub(date, { days: dow == "sat" ? 1 : 2 });
  }

  return date;
};

export const isMarketDay = (date?: Date): Boolean => {
  const dow = DateFnsFormat(date || new Date(), "E").toLowerCase();
  return !["sat", "sun"].includes(dow);
};

export const dateIsToday = (compdate: Date | string | number): Boolean =>
  formatDate(compdate, "yyyy-MM-dd") == formatDate(new Date(), "yyyy-MM-dd");
