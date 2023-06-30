import { dateIsToday, formatDate } from "app/lib/helpers";
import { TopFiling } from "./controls/filing.control";

const TopFilingHelper = (filing: TopFiling) => {
  const { mostRecentTimestamp = 0, weight } = filing;

  return {
    ...filing,
    getNiceWeight: (): string =>
      Number(weight * 100)
        .toFixed(2)
        .toLocaleString(),

    getTimeSince: (): { time: string; date: string } => {
      if (!mostRecentTimestamp) {
        return { time: "n/a", date: "" };
      }

      if (dateIsToday(mostRecentTimestamp)) {
        let timeStr = "";

        // number of seconds since the filing
        const time = Math.floor(Date.now() / 1000) - mostRecentTimestamp;

        const minutes = Math.ceil(time / 60);
        const hours = Math.ceil(time / 60 / 60);

        // less than an hour ago? show minutes
        if (minutes < 60) {
          timeStr = `${minutes} min${minutes > 1 ? "s" : ""}`;
        }
        // less than 4 hours ago? show hours
        else if (hours < 4) {
          timeStr = `${hours} hr${hours > 1 ? "s" : ""}`;
        }
        // less than 24 hours ago? show time
        else if (hours < 24) {
          timeStr = formatDate(mostRecentTimestamp, "h:mmaaa");
        }

        return { time: timeStr, date: "" };
      }

      return {
        time: formatDate(mostRecentTimestamp, "h:mmaaa"),
        date: formatDate(mostRecentTimestamp, "M/dd"),
      };
    },
  };
};

export default TopFilingHelper;
