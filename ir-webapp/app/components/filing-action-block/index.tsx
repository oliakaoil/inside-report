"use client";

import { ObjectHash } from "app/lib/helpers";
import { FC, useEffect, useState } from "react";
import classNames from "classnames";
// import AppTooltip from "../app-tooltip";

interface Props {
  action: string;
  date: string;
}

const ActionMap: ObjectHash = {
  buy: {
    label: "buy",
    tooltip: "The form lists the buying of derivatives and non-derivatives",
    className: "border-lime-600 bg-lime-600",
  },
  sell: {
    label: "sell",
    tooltip: "The form lists the selling of derivatives and non-derivatives",
    className: "border-red-800 bg-red-800",
  },
  both: {
    label: "B/S",
    tooltip:
      "The form lists both the buying and selling of derivatives and non-derivatives",
    className: "border-orange-500 bg-orange-500",
  },
  unknown: {
    label: "UNK",
    tooltip:
      "We were unable to determine the net action based on information in the form",
    className: "border-slate-300 bg-slate-300",
  },
  nonaction: {
    label: "NA",
    tooltip:
      "The form does not list either buying or selling of derivatives and non-derivatives",
    className: "border-slate-300 bg-slate-300",
  },
};

const FilingActionBlock: FC<Props> = ({ action, date }) => {
  const { label, tooltip, className } = ActionMap[action];

  const [dateClient, setDateClient] = useState("");
  useEffect(() => {
    setDateClient(date);
  }, [date]);

  return (
    <div
      className={classNames(
        "h-full px-1 md:px-2 py-2 box-border rounded-r border",
        className
      )}
    >
      {/* <AppTooltip content={tooltip}> */}
      <div className="text-center text-lg">
        <div className="text-center text-lg">
          <span className="capitalize">{label}</span>
        </div>
      </div>
      <div className="text-center text-xs min-h-[20px]">{dateClient}</div>
      {/* </AppTooltip> */}
    </div>
  );
};

export default FilingActionBlock;
