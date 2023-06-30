/** @format */

import UserFilingSearchDb, { IUserFilingSearch } from "../models/user.model";

export const addFilingSearch = async (
  ufSearch: IUserFilingSearch
): Promise<IUserFilingSearch | null> => {
  return UserFilingSearchDb.create({
    ...ufSearch,
    updated: Date.now(),
    created: Date.now(),
  });
};
