import { connect } from "lib/database";
import { NextApiRequest, NextApiResponse } from "next";
import { find } from "lib/services/ident.service";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { keyword = "" } = req.query;

  const result = await find(keyword as string);

  res.status(200).json(result);
}
