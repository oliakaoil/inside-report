import React, { forwardRef, Ref, useState } from "react";
import classnames from "classnames";
import "./toggle-switch.scss";

export interface Props {
  disabled?: boolean;
  onChange: CallableFunction;
  on: boolean;
  size?: "small";
}

const ToggleSwitch = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const { on, onChange, disabled, size } = props;
  const [onStatus, setOnStatus] = useState(on);

  const handleChange = () => {
    if (disabled) {
      return;
    }
    const newStatus = !onStatus;
    setOnStatus(newStatus);
    onChange(newStatus);
  };

  return (
    <div
      className={classnames("toggle-switch", size, {
        disabled,
        on: onStatus,
      })}
      onClick={() => handleChange()}
      ref={ref}
    >
      <div className="handle"></div>
    </div>
  );
});

export default ToggleSwitch;
