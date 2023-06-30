import { FC } from "react";
import FilingList from "app/components/filing-list";
import PageHeader from "app/components/page-header";

interface Props {}

// export const revalidate = 60 * 2;

// const getData = async (): Promise<IFiling[]> => {
//   await connect();
//   return find("", ["buy", "sell"], "last-5");
// };

/* @ts-expect-error Server Component */
const Page: FC<Props> = async () => {
  // const filings = await getData();

  return (
    <>
      <PageHeader title="All Filings"></PageHeader>
      <FilingList />
    </>
  );
};

export default Page;
