import { connect } from "lib/database";
import { NextApiRequest, NextApiResponse } from "next";
import { add } from "lib/services/contact.service";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const result = await add(req.body);

  res.status(200).json(result);
}
