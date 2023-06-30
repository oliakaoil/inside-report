import mongoose, { Schema, model } from "mongoose";

export interface IContact {
  name: string;
  email: string;
  formName: string;
  message?: string;
  last_modified: number;
}

export const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  formName: { type: String, required: true },
  message: { type: String, required: false },
  last_modified: { type: Number, required: true },
});

export default mongoose.models.Contact ||
  model<IContact>("Contact", ContactSchema);
