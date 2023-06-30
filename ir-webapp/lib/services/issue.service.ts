/** @format */

import { muxIdProp } from "lib/database";
import IssueDB, { IIssue } from "../models/issue.model";

export const findBySymbol = async (symbol: string): Promise<IIssue | null> => {
  try {
    const query = IssueDB.findOne({ symbol, deleted: false });

    const result = await query.exec();

    return result ? (result as IIssue) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const findBySymbols = async (symbols: string[]): Promise<IIssue[]> => {
  try {
    const query = IssueDB.find({ symbol: { $in: symbols }, deleted: false });

    const result = await query.lean().exec();

    return muxIdProp(result) as IIssue[];
  } catch (err) {
    console.error(err);
    return [];
  }
};
