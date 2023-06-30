/** @format */

import React, {
  KeyboardEvent,
  FC,
  ChangeEvent,
  forwardRef,
  useState,
  useRef,
} from "react";
import classnames from "classnames";
import debounce from "lodash/debounce";
import AppIcon from "../app-icon";

interface Props {
  autoFocus?: boolean;
  className?: string;
  onEnterKeyPress?: (value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  ref?: any;
  defaultValue?: string;
  textarea?: boolean;
  value?: string;
  clearable?: boolean;
}

const TextInput: FC<Props> = forwardRef((props: Props, ref: any) => {
  const {
    autoFocus = false,
    className = "",
    onChange,
    onEnterKeyPress,
    placeholder = "",
    defaultValue = "",
    textarea = false,
    value: parentControlValue,
    clearable = false,
  } = props;

  const [controlValue, setControlValue] = useState(defaultValue);

  const inputRef = ref || useRef(null);

  // the input can either be controlled by its own state, or by its parent component
  const isParentControlled = typeof parentControlValue === undefined;
  const getValue = (): string =>
    isParentControlled ? (parentControlValue as string) : controlValue;

  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      onEnterKeyPress && onEnterKeyPress(getValue());
      return;
    }
  };

  const handleChange = debounce((val: string) => {
    onChange && onChange(val);
  }, 200);

  const handleControlInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = event.target.value || "";

    if (isParentControlled) {
      onChange && onChange(val);
      return;
    }

    setControlValue(val);
    handleChange(val);
  };

  const handleClear = () => {
    if (!isParentControlled) {
      setControlValue("");
    }

    onChange && onChange("");

    inputRef?.current?.focus();
  };

  const isClearable = clearable && Boolean(String(getValue()).length);

  const inputClasses = classnames(
    `border border-theme-border-gray rounded-md p-2 pr-[30px] outline-0 bg-theme-bg-input-gray border-box`,
    className
  );

  if (textarea) {
    return (
      <textarea
        autoFocus={autoFocus}
        className={inputClasses}
        ref={inputRef}
        onKeyPress={handleKeyPress}
        onChange={handleControlInput}
        placeholder={placeholder}
        value={getValue()}
      />
    );
  }

  return (
    <div className="inline-block relative w-full">
      <input
        autoFocus={autoFocus}
        type="text"
        className={inputClasses}
        ref={inputRef}
        onKeyPress={handleKeyPress}
        onChange={handleControlInput}
        value={getValue()}
        placeholder={placeholder}
      />
      {isClearable && (
        <AppIcon
          type="close"
          size="large"
          className="absolute top-[9px] right-[8px] cursor-pointer"
          onClick={() => handleClear()}
        />
      )}
    </div>
  );
});

export default TextInput;
