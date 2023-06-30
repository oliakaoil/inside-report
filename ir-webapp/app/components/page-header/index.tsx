import { FC } from "react";

interface Props {
  title: string | JSX.Element;
  children?: JSX.Element | JSX.Element[];
}

const PageHeader: FC<Props> = ({ title, children = null }) => {
  return (
    <div className="pb-2 mb-5 border-b border-theme-border-gray flex items-center justify-start">
      <div className="text-bold text-2xl xl:text-3xl color-theme-text-white">
        {title}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
