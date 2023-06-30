import { TopFiling } from "app/lib/controls/filing.control";
import TopFilingHelper from "app/lib/top-filing-helper";
import { FC, useEffect, useMemo, useState } from "react";
import AppCard from "../app-card";

interface Props {
  topFiling: TopFiling;
}

interface NetActionTagProps {
  label: string;
  className: string;
}

const NetActionTag: FC<NetActionTagProps> = ({ className, label }) => (
  <span
    className={`${className} uppercase border rounded px-2 py-1 leading-[100%]`}
  >
    {label}
  </span>
);

const Row: FC<Props> = ({ topFiling }) => {
  const { filingCount, issuer, buys, sells, symbol } = topFiling;
  const filingHelper = useMemo(() => TopFilingHelper(topFiling), [topFiling]);

  const [dateClient, setDateClient] = useState<{ time: string; date: string }>({
    time: "~",
    date: "",
  });
  useEffect(() => {
    setDateClient({ ...filingHelper.getTimeSince() });
  }, [filingHelper]);

  let label = "";
  let className = "";
  if (buys && sells) {
    className = "border-orange-500 bg-orange-500 text-sm";
    label = "Neutral";
  } else if (buys) {
    className = "border-lime-600 bg-lime-600";
    label = `Buy`;
  } else {
    className = "border-red-800 bg-red-800";
    label = `Sell`;
  }

  const handleClick = () => {
    window.location.href = `/s/${symbol}`;
  };

  return (
    <AppCard className="h-[110px]" onClick={handleClick}>
      <div className="w-3/12">
        <div className="text-3xl font-bold">{symbol}</div>
        <div className="mt-2">
          <div className="hidden text-xs lg:text-sm md:block">{issuer}</div>

          <div className="mt-4 md:hidden">
            <NetActionTag label={label} className={className} />
          </div>
        </div>
      </div>
      <div className="w-1/12">&nbsp;</div>
      <div className="w-1/12 text-sm text-white h-full items-center hidden md:flex">
        <NetActionTag label={label} className={className} />
      </div>
      <div className="w-2/12 h-full flex items-center justify-center">
        {filingCount}
      </div>
      <div className="w-3/12 h-full flex items-center justify-center">
        {filingHelper.getNiceWeight()}
      </div>
      <div className="w-4/12 h-full flex flex-col items-center justify-center">
        {dateClient.time}
        {Boolean(dateClient.date) && (
          <div className="mt-1 text-sm">{dateClient.date}</div>
        )}
      </div>
    </AppCard>
  );
};

export default Row;
