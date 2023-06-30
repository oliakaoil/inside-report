import { NextApiRequest, NextApiResponse } from "next";
import { getMeta } from "lib/services/filing.service";
import { connect } from "lib/database";

export default async function async(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { keyword = "", actions = [], date = "" } = req.query;
  const result = await getMeta(
    keyword as string,
    String(actions).split(","),
    date as string
  );
  res.status(200).json(result);
}
