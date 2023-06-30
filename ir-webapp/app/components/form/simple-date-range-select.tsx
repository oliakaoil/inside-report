/** @format */

import React, { FC, forwardRef } from "react";
import { SelectOption } from "app/lib/helpers";
import Select from "app/components/form/select";

interface Props {
  className?: string;
  onChange?: (value: SelectOption | null) => void;
  value?: string;
  ref?: any;
  size?: "small";
}

export const Options = [
  { label: "Last 24 hrs", value: "today" },
  { label: "Last 5 days", value: "last-5" },
  { label: "Last 10 days", value: "last-10" },
  { label: "Last 60 days", value: "last-60" },
];

const SimpleDateRangeSelect: FC<Props> = forwardRef(
  ({ className, onChange, value, size }: Props, ref: any) => {
    const handleChange = (value: SelectOption | null) => {
      onChange && onChange(value);
    };

    return (
      <Select
        className={className}
        options={Options}
        onChange={handleChange}
        ref={ref}
        value={value}
        width={size === "small" ? 135 : 175}
        size={size}
      />
    );
  }
);

export default SimpleDateRangeSelect;
