import React, { FC, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";

interface Props {
  children: JSX.Element | JSX.Element[];
  content: string;
  disabled?: boolean;
  force?: boolean;
  onForceHide?: () => void;
  place?: "top" | "right" | "bottom" | "left" | "";
}

const AppTooltip: FC<Props> = ({
  children,
  content,
  disabled = false,
  force = false,
  onForceHide,
  place = "",
}: Props) => {
  const ref = useRef(null);
  const [forceDisabled, setForceDisabled] = useState(false);

  // hax
  if (force && !disabled) {
    setTimeout(() => {
      ReactTooltip.show(ref?.current as any);
    }, 400);

    const forceHide = () => {
      setForceDisabled(true);

      setTimeout(() => {
        ReactTooltip.hide();
        //ReactTooltip.rebuild();

        window.removeEventListener("click", forceHide);
        (ref.current as any)?.removeEventListener("mouseout", forceHide);

        onForceHide && onForceHide();
      }, 500);
    };

    window.addEventListener("click", forceHide);
    (ref.current as any)?.addEventListener("mouseout", forceHide);
  }

  return (
    <>
      <div
        ref={ref}
        data-effect="solid"
        data-type="info"
        data-tip={content}
        data-tip-disable={forceDisabled || disabled}
        data-after-hide
        data-place={place}
      >
        {children}
      </div>
      <ReactTooltip />
    </>
  );
};

export default AppTooltip;
