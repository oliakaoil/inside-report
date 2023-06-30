import { NextApiRequest, NextApiResponse } from "next";
import { getTopFilings } from "lib/services/filing.service";
import { connect } from "lib/database";

export default async function async(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const { date = "today", actions = "" } = req.query;
  const result = await getTopFilings(String(actions).split(","));
  res.status(200).json(result);
}
