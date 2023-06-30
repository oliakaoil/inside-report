import FilingDB, { IFiling } from "lib/models/filing.model";
import { findBySymbol } from "./issue.service";
import { ObjectHash } from "lib/helpers";
import uniq from "lodash/uniq";

export type Ident = {
  type: "symbol" | "insider";
  meta: ObjectHash | null;
  name: "";
};

type IdentResponse = {
  keyword: string;
  idents: Ident[];
};

export const find = async (keyword: string): Promise<IdentResponse> => {
  const response: IdentResponse = { keyword, idents: [] };

  // symbol look-up
  try {
    const result = await findBySymbol(String(keyword).trim().toUpperCase());

    if (result) {
      response.idents.push({
        type: "symbol",
        name: result.symbol,
        meta: result,
      });
      return response;
    }
  } catch (err) {
    console.error(err);
    return null;
  }

  // insider look-up
  try {
    const result = await FilingDB.find({
      "meta.name": new RegExp(String(keyword).trim(), "i"),
    })
      .lean()
      .limit(21)
      .exec();

    console.log(result.length);

    if (result?.length) {
      result.forEach(({ meta = {} }) => {
        const exists = response.idents.find(
          ({ meta: eMeta = {} }) => eMeta.name === meta.name
        );
        if (exists) {
          return;
        }

        response.idents.push({
          type: "insider",
          name: meta.name,
          meta,
        });
      });

      return response;
    }
  } catch (err) {
    console.error(err);
    return null;
  }

  return response;
};
