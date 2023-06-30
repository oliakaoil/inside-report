import startCase from "lodash/startCase";
import upperFirst from "lodash/upperFirst";
import { dateIsToday, formatDate } from "app/lib/helpers";
import { IFiling } from "lib/models/filing.model";

export type FilingNetAmount = {
  derivative: { acquired: number; disposed: number };
  non_derivative: { acquired: number; disposed: number };
};

const FilingHelper = (filing: IFiling) => {
  const { meta, last_modified = 0, url, filing_id } = filing;
  const { name, relationship } = meta;

  return {
    ...filing,
    getNiceName: (): string => startCase(String(name).toLowerCase()),
    getNiceRelationship: (): string => upperFirst(relationship),
    getTimeSince: (): string => {
      if (!last_modified) {
        return "n/a";
      }

      if (dateIsToday(last_modified)) {
        // number of seconds since the filing
        const time = Math.floor(Date.now() / 1000) - last_modified;

        // less than an hour ago? show minutes
        const minutes = Math.ceil(time / 60);
        if (minutes < 60) {
          return `${minutes} min${minutes > 1 ? "s" : ""}`;
        }

        // less than 4 hours ago? show hours
        const hours = Math.ceil(time / 60 / 60);

        if (hours < 4) {
          return `${hours} hr${hours > 1 ? "s" : ""}`;
        }

        // less than 24 hours ago? show time
        if (hours < 24) {
          return formatDate(last_modified, "h:mmaaa");
        }
      }

      return formatDate(last_modified, "M/dd h:mmaaa");
    },
    getPostedDate: (): string =>
      last_modified
        ? formatDate(last_modified * 1000, "M/dd/yyyy h:mmaaa")
        : "n/a",
    getNetAmounts: (): FilingNetAmount => {
      const amounts = {
        derivative: { acquired: 0, disposed: 0 },
        non_derivative: { acquired: 0, disposed: 0 },
      };
      const { derivatives, non_derivatives } = meta;

      if (!derivatives.length && !non_derivatives.length) {
        return amounts;
      }

      if (derivatives) {
        derivatives.forEach(({ amount_acquired, amount_disposed }) => {
          amounts.derivative.acquired += amount_acquired || 0;
          amounts.derivative.disposed += amount_disposed || 0;
        });
      }

      if (non_derivatives) {
        non_derivatives.forEach(({ amount, action }) => {
          if (!action) {
            return;
          }

          const actionId = String(action).toUpperCase()[0];

          if (actionId === "A") {
            amounts.non_derivative.acquired += amount || 0;
          } else if (actionId === "D") {
            amounts.non_derivative.disposed += amount || 0;
          } else {
            console.warn("unknown action", action, url);
          }
        });
      }

      return amounts;
    },
    getShortFilingId: (): string => {
      const fid = String(filing_id);
      return fid.substring(0, 6) + ":" + fid.substring(fid.length - 6);
    },
  };
};

export default FilingHelper;
