/** @format */

"use client";

import { ChangeEvent, FC, useMemo, useState } from "react";
import AppIcon from "app/components/app-icon";
import classnames from "classnames";
import { debounce } from "lodash";

interface Props {
  page: number;
  perPage: number;
  total: number;
  onChange: (page: number) => void;
}

const Pagination: FC<Props> = ({
  page: defaultPage,
  perPage,
  total,
  onChange,
}) => {
  const lastPage = Math.ceil(total / perPage);
  const debounceOnChange = useMemo(() => debounce(onChange, 400), []);
  const [page, setPage] = useState(defaultPage);

  const handleControlInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = String(event.target.value || "");

    if (!val) {
      setPage(0);
      return;
    }

    let newPage = Number(
      String(event.target.value || "").replace(/[^0-9]+/, "")
    );
    if (isNaN(newPage)) {
      newPage = 1;
    } else if (newPage > lastPage) {
      newPage = lastPage;
    }
    setPage(newPage);
    debounceOnChange(newPage);
  };

  const handleBumpPage = (amount: number) => {
    let newPage = page + amount;
    if (newPage > lastPage) {
      newPage = lastPage;
    } else if (newPage < 1) {
      newPage = 1;
    }
    if (newPage === page) {
      return;
    }
    setPage(newPage);
    onChange(newPage);
  };

  const hasNextPage = page + 1 < lastPage;
  const hasPrevPage = page > 1;

  return (
    <div className="flex items-center">
      <div>Page</div>
      <input
        value={page || ""}
        onChange={handleControlInput}
        className="w-8 block border border-theme-border-gray rounded-md p-1 outline-0 bg-theme-bg-input-gray ml-2 outline-none"
      />
      <div className="ml-2 min-w-[10px]">
        {lastPage ? `of ${lastPage.toLocaleString()}` : ""}
      </div>
      <div className="ml-3">
        <AppIcon
          type="arrow-left-circle"
          onClick={() => handleBumpPage(-1)}
          className={classnames({ "cursor-pointer": hasPrevPage })}
        />
      </div>
      <div className="ml-2">
        <AppIcon
          type="arrow-right-circle"
          onClick={() => handleBumpPage(1)}
          className={classnames({ "cursor-pointer": hasNextPage })}
        />
      </div>
      <div className="ml-3 text-sm">{total.toLocaleString()} results</div>
    </div>
  );
};

export default Pagination;
