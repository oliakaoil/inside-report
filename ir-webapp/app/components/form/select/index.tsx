import { CSSProperties, FC, forwardRef } from "react";
import ReactSelect from "react-select";
import ReactSelectAsync from "react-select/async";
import { ObjectHash, SelectOption } from "app/lib/helpers";

import "./select.scss";

interface Props {
  blinkBorder?: boolean;
  className?: string;
  defaultOptions?: SelectOption[];
  isClearable?: boolean;
  options: SelectOption[];
  onChange?: (value: SelectOption | null) => void;
  onSearch?: (value: string) => Promise<SelectOption[]>;
  value?: string;
  ref?: any;
  width?: string | number;
  size?: "small";
}

/*
 * React Select controlled vs uncontrolled
 * - Because React Select is designed as a drop-in replacement for <select>, it replicates HTML input controlled/uncontrolled behavior
 * - Uncontrolled by default
 * - If you define the "value" prop as !undefined, behavior changes to controlled
 * - If you define the "value" prop as undefined, then later change it to something valid, behavior changes to controlled from uncontrolled
 *   from uncontrolled, but does not trigger any related/expected warnings (i.e. https://stackoverflow.com/questions/37427508/react-changing-an-uncontrolled-input)
 */

const Select: FC<Props> = forwardRef(
  (
    {
      blinkBorder = false,
      className = "",
      defaultOptions,
      isClearable = false,
      options,
      onChange,
      onSearch,
      value,
      width = "auto",
      size,
    }: Props,
    ref: any
  ) => {
    const controlValue = [...(defaultOptions || []), ...options].find(
      (opt: SelectOption) => opt.value === value
    );

    const handleChange = (value: SelectOption | null) => {
      onChange && onChange(value);
    };

    // Users of this componet should not need to know about this implementation detail, so
    // abstract it away to simply declaring an onSearch prop to trigger "async behavior"
    const ReactSelectComponent = onSearch ? ReactSelectAsync : ReactSelect;

    const reactSelectProps: ObjectHash = {
      instanceId: "react-select-instance",
    };
    if (onSearch) {
      reactSelectProps.loadOptions = onSearch;
    }
    if (defaultOptions) {
      reactSelectProps.defaultOptions = defaultOptions;
    }

    const isSmall = size === "small";

    const getSizeStyles = (): any => {
      return (baseStyles: CSSProperties, state: any) => ({
        ...baseStyles,
        fontSize: isSmall ? "12px" : baseStyles.fontSize,
      });
    };

    return (
      <ReactSelectComponent
        className={`${className}${blinkBorder ? " blink-border" : ""}`}
        classNamePrefix="app_select"
        isClearable={isClearable}
        options={options}
        onChange={handleChange}
        ref={ref}
        value={controlValue}
        {...reactSelectProps}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            width,
            minHeight: isSmall ? 30 : 42,
          }),
          singleValue: getSizeStyles(),
          option: getSizeStyles(),
          placeholder: getSizeStyles(),
        }}
      />
    );
  }
);

export default Select;

// single-value font-size
