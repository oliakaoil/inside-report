/** @format */

import { connect as MongooseConnect, LeanDocument } from "mongoose";

export const connect = async (): Promise<Boolean> => {
  const { DATABASE_URL = "" } = process.env;

  if (!DATABASE_URL) {
    return false;
  }

  try {
    await MongooseConnect(DATABASE_URL);
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
};

export const muxIdProp = (docs: LeanDocument<any>[]): LeanDocument<any>[] => {
  return docs.map((doc: LeanDocument<any>) => {
    doc.id = doc._id.toString();
    delete doc._id;
    return doc;
  });
};
