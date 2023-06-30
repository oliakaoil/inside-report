import mongoose, { Schema, model } from "mongoose";

export interface IUserFilingSearch {
  userId: string;
  name: string;
  keyword: string;
  actionFilter: string[];
  dateFilter: string;
  created: number;
  updated: number;
}

export const UserFilingSearchSchema = new Schema<IUserFilingSearch>({
  userId: { type: String, required: false },
  name: { type: String, required: true },
  keyword: { type: String, required: true },
  actionFilter: { type: [String], required: true },
  dateFilter: { type: String, required: true },
});

export default mongoose.models.UserFilingSearch ||
  model<IUserFilingSearch>("UserFilingSearch", UserFilingSearchSchema);
