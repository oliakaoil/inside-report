"use client";

import { FC } from "react";
import SelectToggleMenu, { SelectToggleOption } from "../select-toggle-menu";

interface Props {
  defaultValue?: string[];
  onChange: (opts: SelectToggleOption[]) => void;
}

const Options: SelectToggleOption[] = [
  { id: "buy", name: "Buys" },
  { id: "sell", name: "Sells" },
  { id: "unknown", name: "Unknown" },
  { id: "nonaction", name: "Non-action" },
];

const FilingActionSelect: FC<Props> = ({ defaultValue, onChange }) => {
  return (
    <div className="w-full md:w-[180px]">
      <SelectToggleMenu
        searchable={false}
        selectedOptionIds={defaultValue || ["buy", "sell"]}
        multiSelect={true}
        onChange={onChange}
        options={Options}
        maxSelectedOptions={2}
        width={200}
      />
    </div>
  );
};

export default FilingActionSelect;
