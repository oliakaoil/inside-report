import { FC } from "react";
import "./dots.scss";

interface Props {}

const Dots: FC<Props> = () => {
  return (
    <div className="dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default Dots;
