import mongoose, { Schema, model } from "mongoose";

export interface NonDerivative {
  title: string;
  transaction_date: string;
  deemded_date: string;
  transaction_code: string;
  transaction_v: string;
  amount: number;
  action: string;
  price: string;
  amount_owned: number;
  ownership_form: string;
  instrument_4: string;
}

export interface Derivative {
  title: string;
  ex_price: number;
  transaction_date: string;
  transaction_v: string;
  amount_acquired: number;
  amount_disposed: number;
  ex_date: string;
  exp_date: string;
  security_title: string;
  security_amount: number;
  price: number;
  amount_owned: number;
  ownership_form: string;
  instrument_4: string;
}

export interface IFilingMeta {
  name: string;
  name_cik: string;
  issuer: string;
  issuer_cik: string;
  symbol: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  relationship: string;
  relationship_detail: string;
  early_date: string;
  joint_filing: boolean;
  created_date: string;
  non_derivatives: NonDerivative[];
  derivatives: Derivative[];
  net_action: string;
  extra_symbols: string[];
  raw_symbol: string;
}

export interface IFiling {
  date: string;
  filing_id: string;
  last_modified: number;
  meta: IFilingMeta;
  path: string;
  type: string;
  url: string;
}

export const FilingSchema = new Schema<IFiling>({
  date: { type: String, required: true },
  filing_id: { type: String, required: true, unique: true },
  last_modified: { type: Number, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  meta: { type: Map },
});

export default mongoose.models.Filing || model<IFiling>("Filing", FilingSchema);
