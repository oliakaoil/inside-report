/** @format */

import { FC } from "react";
import { connect } from "lib/database";
import { getTopFilings } from "lib/services/filing.service";
import PageHeader from "../components/page-header";
import TopFilings from "../components/top-filings";
import { TopFiling } from "../lib/controls/filing.control";

interface Props {}

export const revalidate = 60 * 60;

const getData = async (): Promise<{ date: number; filings: TopFiling[] }> => {
  await connect();
  return getTopFilings(["buy", "sell"]);
};

/* @ts-expect-error Server Component */
const Page: FC<Props> = async () => {
  const topFilings = await getData();

  const titleEl = (
    <>
      Most Active Companies
      <div className="mt-2 text-sm">last 24 hours</div>
    </>
  );

  return (
    <>
      <PageHeader title={titleEl} />
      <TopFilings topFilings={topFilings} />
    </>
  );
};

export default Page;
