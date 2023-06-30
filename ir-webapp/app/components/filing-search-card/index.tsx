/** @format */

import React, { FC, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../button";
import { UserFilingSearch } from "app/lib/controls/user.control";
import { Options as DateRangeOptions } from "app/components/form/simple-date-range-select";
import { set, get } from "app/lib/local-storage";
import TextInput from "../form/text-input";
import AppIcon from "../app-icon";
import { getUnixTimestamp } from "app/lib/helpers";
import usePanelController from "app/lib/hooks/use-panel-controller";
import IconLink from "../icon-link";
import FoldCard from "../fold-card";

interface Props {
  filingSearch: UserFilingSearch;
  onCancel?: (filingSearch: UserFilingSearch) => void;
  onSave?: (filingSearch: UserFilingSearch) => void;
  onLoad?: (filingSearch: UserFilingSearch) => void;
  onDelete?: (filingSearch: UserFilingSearch) => void;
}

const FilingSearchCard: FC<Props> = ({
  filingSearch,
  onCancel,
  onSave,
  onLoad,
  onDelete,
}) => {
  const { id, name, dateFilter, actionFilter, keyword } = filingSearch;
  const isNew = !Boolean(id);
  const { open } = usePanelController();

  const [editMode, setEditMode] = useState(isNew);
  const [searchName, setSearchName] = useState(name || "");
  const [canSave, setCanSave] = useState(false);

  const handleLoad = () => {
    onLoad && onLoad(filingSearch);
  };

  const handleAlert = () => {
    open("alerts");
  };

  const handleDelete = () => {
    if (isNew) {
      return;
    }
    const searches = get("filing-searches", true) || [];
    const findex = searches.findIndex(
      ({ id: searchId }: UserFilingSearch) => searchId === id
    );

    if (findex === -1) {
      return;
    }

    searches.splice(findex, 1);
    set("filing-searches", searches);
    onDelete && onDelete(filingSearch);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSearchName(name);
    onCancel && onCancel(filingSearch);
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    if (isNew) {
      filingSearch.id = uuidv4();
      filingSearch.created = getUnixTimestamp();
    }

    filingSearch.updated = getUnixTimestamp();

    const updatedSearch = { ...filingSearch, name: searchName };

    const searches = get("filing-searches", true) || [];
    const findex = searches.findIndex(
      ({ id: searchId }: UserFilingSearch) => searchId === id
    );

    if (findex === -1) {
      searches.push(updatedSearch);
    } else {
      searches[findex] = updatedSearch;
    }

    set("filing-searches", searches);

    setEditMode(false);

    onSave && onSave(filingSearch);
  };

  const date =
    DateRangeOptions.find(({ value }) => value === dateFilter)?.label || "";

  useEffect(() => {
    setCanSave(Boolean(searchName));
  }, [searchName]);

  const titleEl = (
    <>
      {editMode && (
        <TextInput
          autoFocus
          defaultValue={searchName}
          onChange={setSearchName}
          placeholder="Type a search name"
          className="w-5/6"
        />
      )}
      {!editMode && <div className="text-white">{searchName}</div>}
    </>
  );

  return (
    <FoldCard title={titleEl} open={isNew} disabled={isNew}>
      <div className="w-full mb-4">
        <div className="flex w-full mb-2">
          <div className="w-1/2 font-bold">Date range:</div>
          <div className="w-1/2">{date}</div>
        </div>

        <div className="flex w-full mb-2">
          <div className="w-1/2 font-bold">Actions:</div>
          <div className="w-1/2">
            {Boolean(actionFilter.length) ? (
              actionFilter.join(", ")
            ) : (
              <span className="italic">none</span>
            )}
          </div>
        </div>

        <div className="flex w-full">
          <div className="w-1/2 font-bold">Keyword:</div>
          <div className="w-1/2">
            {keyword || <span className="italic">none</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div>
          {editMode && (
            <>
              <Button
                label={isNew ? "Create" : "Save"}
                size="xsmall"
                onClick={() => handleSave()}
                disabled={!canSave}
              />
              <IconLink
                label="Cancel"
                onClick={() => handleCancel()}
                className="ml-4"
                icon="close"
                size="small"
                iconSize="x-small"
              />
            </>
          )}
          {!editMode && !isNew && (
            <>
              <Button label="Load" size="xsmall" onClick={() => handleLoad()} />
              <Button
                label="Get Alerts"
                color="third"
                size="xsmall"
                icon="add-notif"
                onClick={() => handleAlert()}
                className="ml-2"
              />
            </>
          )}
        </div>
        <div className="flex-grow flex justify-end items-center">
          <div className="flex w-100">
            {!isNew && (
              <>
                <AppIcon
                  type="edit-pencil"
                  className="cursor-pointer mr-2"
                  color="white"
                  onClick={() => setEditMode(true)}
                />

                <AppIcon
                  type="trash"
                  color="white"
                  className="cursor-pointer"
                  onClick={() => handleDelete()}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </FoldCard>
  );
};

export default FilingSearchCard;
