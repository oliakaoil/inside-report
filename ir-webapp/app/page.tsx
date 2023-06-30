/** @format */

import { FC } from "react";
import HomeSearch from "./components/home-search";

interface Props {}

/* @ts-expect-error Server Component */
const Page: FC<Props> = async () => {
  return (
    <>
      <HomeSearch />
    </>
  );
};

export default Page;
