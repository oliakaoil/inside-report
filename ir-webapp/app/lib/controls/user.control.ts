import { post } from "../helpers";

export type UserFilingSearch = {
  id: string;
  name: string;
  keyword: string;
  actionFilter: string[];
  dateFilter: string;
  created?: number;
  updated?: number;
};

export const addFilingSearch = (
  params: UserFilingSearch
): Promise<UserFilingSearch | null> => {
  return post("/api/user/filing-search", params).then((res) => res.json());
};
