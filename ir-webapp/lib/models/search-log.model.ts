import mongoose, { Schema, model } from "mongoose";

export interface ISearchLog {
  keyword: string;
  query: string;
  total: number;
  last_modified: number;
}

export const SearchLogSchema = new Schema<ISearchLog>({
  keyword: { type: String, required: false },
  total: { type: Number, required: true },
  query: { type: String, required: true },
  last_modified: { type: Number, required: true },
});

export default mongoose.models.SearchLog ||
  model<ISearchLog>("SearchLog", SearchLogSchema);
