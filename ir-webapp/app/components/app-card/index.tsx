import { FC, MouseEvent } from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const AppCard: FC<Props> = ({ children, className = "", onClick }) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick && onClick(event);
  };

  if (onClick) {
    className = `${className} cursor-pointer`;
  }

  return (
    <div
      className={`flex mb-3 p-3 border rounded border-theme-border-gray ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default AppCard;
