import mongoose, { Schema, model } from "mongoose";

export interface IIssue {
  symbol: string;
  currency: string;
  exchange: string;
  shares: number;
  market_cap: number;
  last_price: number;
  fifty_day_average: number;
  two_hundred_day_average: number;
  ten_day_average_volume: number;
  three_month_average_volume: number;
  year_high: number;
  year_low: number;
  year_change: number;
  created_at: Date;
  deleted: boolean;
}

export const IssueSchema = new Schema<IIssue>({
  symbol: { type: String, required: true },
  currency: { type: String, required: true },
  exchange: { type: String, required: true },
  shares: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  last_price: { type: Number, required: true },
  fifty_day_average: { type: Number, required: true },
  two_hundred_day_average: { type: Number, required: true },
  ten_day_average_volume: { type: Number, required: true },
  three_month_average_volume: { type: Number, required: true },
  year_high: { type: Number, required: true },
  year_low: { type: Number, required: true },
  year_change: { type: Number, required: true },
  created_at: { type: Date, required: true },
  deleted: { type: Boolean, required: true },
});

export default mongoose.models.Issue || model<IIssue>("Issue", IssueSchema);
