import { FC } from "react";
import InsiderPage from "app/components/insider-page";

interface Props {
  params: { symbol: string };
}

/* @ts-expect-error Server Component */
const Page: FC<Props> = async ({ params }) => {
  const { insider } = params;

  return (
    <>
      <InsiderPage insider={insider} />
    </>
  );
};

export default Page;
