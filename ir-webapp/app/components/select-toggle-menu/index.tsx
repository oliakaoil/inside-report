"use client";

import React, {
  FC,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import ClickAwayListener from "react-click-away-listener";
import classnames from "classnames";

import AppIcon from "../app-icon";
import CloseOnScroll from "../close-on-scroll";
import TextInput from "../form/text-input";
import ToggleSwitch from "../toggle-switch";
import usePrevious from "app/lib/hooks/use-previous.hook";
import AppChip from "../app-chip";

import "./select-toggle-menu.scss";

export interface SelectToggleOption {
  id: string;
  name: string;
}

type MenuPosition = {
  top?: number;
  left?: number;
  right?: number;
};

interface SearchFunction {
  (keyword: string): Promise<SelectToggleOption[]>;
}

const sortByName = (aOpt: SelectToggleOption, bOpt: SelectToggleOption) => {
  return aOpt.name > bOpt.name ? 1 : -1;
};

export interface Props {
  createOption?: boolean;
  isDisabled?: boolean;
  maxSelectedOptions?: number;
  menuPortalTarget?: any;
  menuPosition?: "left" | "right";
  multiSelect?: boolean;
  onChange: (options: SelectToggleOption[]) => void;
  onFilterOptions?: CallableFunction;
  onOption?: (option: SelectToggleOption) => JSX.Element | string;
  onSearch?: SearchFunction;
  onSelectedOption?: (option: SelectToggleOption) => JSX.Element | string;
  options?: SelectToggleOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectedOptionIds?: string[];
  width?: number | string;
}

interface MenuState {
  open: boolean;
  position: MenuPosition;
  searchKeyword: string;
}

const SelectToggleMenu: FC<Props> = (props: Props) => {
  const {
    createOption = false,
    isDisabled = false,
    maxSelectedOptions = 1,
    menuPortalTarget,
    menuPosition = "left",
    onFilterOptions,
    onOption,
    onSearch,
    onSelectedOption,
    placeholder = "",
    searchable = true,
    searchPlaceholder = "",
    width,
  } = props;

  const multiSelect =
    typeof props.multiSelect === "boolean" ? props.multiSelect : true;

  const defaultOptions = useMemo(
    () => (props.options ? [...props.options] : []),
    [props.options]
  );

  const searchInputRef = useRef(null);

  const [options, setOptions] = useState<SelectToggleOption[]>(defaultOptions);

  const [menuState, setMenuState] = useState<MenuState>({
    open: false,
    position: { top: 0, left: 0 },
    searchKeyword: "",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const previousSearchTerm = usePrevious(searchTerm);

  const initSelectedOpts: SelectToggleOption[] = [];
  let selectedOptionIds = props.selectedOptionIds || [];
  if (selectedOptionIds) {
    // ensure that non-multi-select inputs only have one selected tag
    if (!multiSelect) {
      selectedOptionIds = selectedOptionIds.slice(0, 1);
    }
    selectedOptionIds.forEach((optionId: string) => {
      const selectedOpt = options.find(
        (opt: SelectToggleOption) => opt.id === optionId
      );
      if (selectedOpt) {
        initSelectedOpts.push(selectedOpt);
      }
    });
  }

  const [selectedOpts, setSelectedOpts] =
    useState<SelectToggleOption[]>(initSelectedOpts);

  const headerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs: Map<string, any> = new Map();

  const hasOptions = Boolean(options.length);
  const hasSearch = Boolean(onSearch);
  const menuDisabled = (!hasOptions && !hasSearch) || isDisabled;

  const isOptionSelected = useCallback(
    (optionId: string) => {
      return selectedOpts
        .map((opt: SelectToggleOption) => opt.id)
        .includes(optionId);
    },
    [selectedOpts]
  );

  const sortBySelectedName = useCallback(
    (aOpt: SelectToggleOption, bOpt: SelectToggleOption) => {
      const aSelected = isOptionSelected(aOpt.id);
      const bSelected = isOptionSelected(bOpt.id);

      if (aSelected === bSelected) {
        return aOpt.name > bOpt.name ? 1 : -1;
      }

      return aSelected ? -1 : 1;
    },
    [isOptionSelected]
  );

  const closeMenu = useCallback(() => {
    setOptions([...defaultOptions]);
    setMenuState({ ...menuState, open: false, searchKeyword: "" });
  }, [defaultOptions, menuState, setMenuState]);

  const toggleMenu = useCallback(() => {
    const headerEl = headerRef?.current;
    const position: MenuPosition = { top: 0 };

    if (headerEl) {
      const headerPos = headerEl.getBoundingClientRect();
      position.top = headerPos.top + headerPos.height + 4;
      position.left = headerPos.left;

      // @todo auto-detect this condition rather than allowing fix via props config
      if (menuPosition === "right" && width) {
        const widthDiff = Number(width) - headerPos.width;
        position.left -= widthDiff;
      }
    }

    const open = !menuState.open && !menuDisabled;

    if (open) {
      setOptions([...options].sort(sortBySelectedName));
    }

    setMenuState({
      open,
      position,
      searchKeyword: open ? menuState.searchKeyword : "",
    });
  }, [
    headerRef,
    menuDisabled,
    menuPosition,
    menuState,
    options,
    setMenuState,
    sortBySelectedName,
    width,
  ]);

  const toggleOption = (toggleOpt: SelectToggleOption, selected: boolean) => {
    const { onChange } = props;
    let updatedOpts = [...selectedOpts];

    if (!multiSelect) {
      if (selected) {
        updatedOpts = [toggleOpt];
      } else {
        updatedOpts = [];
      }
    } else {
      if (selected) {
        updatedOpts.push(toggleOpt);
      } else {
        const optIndex = updatedOpts.findIndex(
          (opt: SelectToggleOption) => opt.id === toggleOpt.id
        );
        if (optIndex > -1) {
          updatedOpts.splice(optIndex, 1);
        }
      }
    }

    setSelectedOpts(updatedOpts);
    onChange(updatedOpts);
  };

  useEffect(() => {
    if (searchTerm === previousSearchTerm) {
      return;
    }
    const searchKeyword = searchTerm.toLowerCase();

    let subscribed = true;
    const unsubscribe = () => {
      subscribed = false;
    };

    const makeUniqueOpts = (
      selectedOpts: SelectToggleOption[],
      otherOpts: SelectToggleOption[]
    ) => {
      const uniqueOpts = [...selectedOpts].sort(sortByName);

      otherOpts.forEach((opt: SelectToggleOption) => {
        const optExists = uniqueOpts.find(
          (uOpt: SelectToggleOption) => uOpt.id === opt.id
        );
        if (!optExists) {
          uniqueOpts.push(opt);
        }
      });

      if (createOption && searchTerm) {
        const matchingOption = uniqueOpts.find(
          (opt: SelectToggleOption) =>
            opt.id === searchTerm || opt.name === searchTerm
        );

        if (!matchingOption) {
          uniqueOpts.push({
            id: searchTerm,
            name: searchTerm,
          });
        }
      }

      return uniqueOpts;
    };

    if (onSearch) {
      onSearch(searchKeyword).then((searchOpts: SelectToggleOption[]) => {
        if (subscribed) {
          setOptions(makeUniqueOpts(selectedOpts, searchOpts));
          setMenuState({
            ...menuState,
            searchKeyword,
          });
        }
      });

      return unsubscribe;
    }

    let allOptions = [...(props.options || [])];

    if (searchKeyword) {
      allOptions = allOptions.filter((opt: SelectToggleOption) =>
        String(opt.name).toLowerCase().includes(searchKeyword)
      );
    }

    setOptions(makeUniqueOpts(selectedOpts, allOptions));

    setMenuState({
      ...menuState,
      searchKeyword,
    });

    return unsubscribe;
  }, [
    createOption,
    menuState,
    onSearch,
    previousSearchTerm,
    props.options,
    searchTerm,
    selectedOpts,
    setMenuState,
  ]);

  const optionsFiltered = onFilterOptions ? onFilterOptions(options) : options;

  let displayedOpts: (JSX.Element | string)[] = [];
  const hasSelectedOpts = Boolean(selectedOpts.length);

  if (hasSelectedOpts) {
    for (
      let i = 0;
      i < Math.min(maxSelectedOptions, selectedOpts.length);
      i++
    ) {
      const selectedOpt = selectedOpts.sort(sortByName)[i];
      let displayedOpt: JSX.Element | string = "";

      if (onSelectedOption) {
        displayedOpt = onSelectedOption(selectedOpt);
      } else if (onOption) {
        displayedOpt = onOption(selectedOpt);
      } else {
        displayedOpt = (
          <AppChip label={selectedOpt.name} key={selectedOpt.id} />
        );
      }

      if (displayedOpt) {
        displayedOpts.push(displayedOpt);
      }
    }
  }

  const { open, position } = menuState;

  return (
    <CloseOnScroll alllowedClassName="options-container" onClose={closeMenu}>
      <div
        className={classnames("select-toggle-menu", {
          disabled: menuDisabled,
        })}
      >
        <div
          className="select-toggle-menu-header bg-theme-bg-input-gray text-white border border-theme-border-gray rounded"
          ref={headerRef}
          onClick={toggleMenu}
        >
          <div className="selected-wrapper">
            {!hasSelectedOpts && (
              <div className="placeholder">
                {placeholder ?? "Select Options"}
              </div>
            )}
            {displayedOpts}
            {selectedOpts.length > maxSelectedOptions && (
              <span className="text-sm text-white">...</span>
            )}
          </div>
          <div className="menu-arrow">
            <AppIcon type="menu-arrow" size="small" />
          </div>
        </div>
        {open &&
          createPortal(
            <ClickAwayListener onClickAway={closeMenu}>
              <div
                className="select-toggle-menu-popper text-white bg-theme-bg-input-gray border border-theme-border-gray rounded"
                ref={menuRef}
                style={{
                  ...position,
                  width: width || `calc(100vw - 45px)`,
                }}
              >
                {searchable && (
                  <div className="search-header">
                    <TextInput
                      autoFocus={true}
                      placeholder={searchPlaceholder ?? "Search for an option"}
                      onChange={setSearchTerm}
                      ref={searchInputRef}
                      defaultValue={searchTerm}
                    />
                  </div>
                )}
                <div className="options-container">
                  {optionsFiltered.map((opt: SelectToggleOption) => (
                    <div
                      className="option-row"
                      key={opt.id}
                      onClick={() => {
                        const optionRef = optionRefs.get(opt.id);
                        optionRef.click();
                      }}
                    >
                      <ToggleSwitch
                        ref={(button: any) => optionRefs.set(opt.id, button)}
                        size="small"
                        on={isOptionSelected(opt.id)}
                        onChange={(selected: boolean) => {
                          if (selected && !multiSelect) {
                            selectedOpts.forEach((opt: SelectToggleOption) => {
                              const optionRef = optionRefs.get(opt.id);
                              optionRef.click();
                            });
                          }

                          (searchInputRef.current as any)?.focus();

                          toggleOption(opt, selected);
                        }}
                      />
                      <div className="grow overflow-hidden text-white cursor-pointer">
                        {onOption ? onOption(opt) : opt.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ClickAwayListener>,
            menuPortalTarget ?? document.body
          )}
      </div>
    </CloseOnScroll>
  );
};

export default SelectToggleMenu;
