import { FC } from "react";
import SymbolPage from "app/components/symbol-page";

interface Props {
  params: { symbol: string };
}

/* @ts-expect-error Server Component */
const Page: FC<Props> = async ({ params }) => {
  const { symbol } = params;

  return (
    <>
      <SymbolPage symbol={symbol} />
    </>
  );
};

export default Page;
