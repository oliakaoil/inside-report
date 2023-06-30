import React, { FC } from "react";

interface Props {}

const Logo: FC<Props> = () => {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        backgroundColor: "#363636",
        color: "#51A8D0",
        fontSize: "44pt",
        lineHeight: "100%",
        textAlign: "center",
        fontFamily: "Bebas Neue",
        boxSizing: "border-box",
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      IR
    </div>
  );
};

export default Logo;
