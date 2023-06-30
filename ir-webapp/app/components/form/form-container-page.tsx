/** @format */

import { FC } from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const FormContainerPage: FC<Props> = ({ children }) => {
  return (
    <form autoComplete="off" className="block w-full">
      {children}
    </form>
  );
};

export default FormContainerPage;
