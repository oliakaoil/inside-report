import React, { FC, useEffect } from "react";

interface Props {
  alllowedClassName: string;
  children: JSX.Element | JSX.Element[];
  onClose: CallableFunction;
}

const CloseOnScroll: FC<Props> = ({ alllowedClassName, children, onClose }) => {
  useEffect(() => {
    const handleScroll = (e: any) => {
      if (e.target?.classList?.contains(alllowedClassName)) {
        return true;
      }

      onClose();
    };

    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [alllowedClassName, onClose]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default CloseOnScroll;
