import { connect } from "lib/database";
import { NextApiRequest, NextApiResponse } from "next";
import { addFilingSearch } from "lib/services/user.service";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const result = await add(req.body);

  res.status(200).json(result);
}
