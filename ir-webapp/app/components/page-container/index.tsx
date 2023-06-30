import { FC } from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const PageContainer: FC<Props> = ({ children }) => {
  return <div className="w-full xl:w-4/5 pt-1">{children}</div>;
};

export default PageContainer;
