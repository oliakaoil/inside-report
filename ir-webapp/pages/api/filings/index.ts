/** @format */

// import fs from "fs";
// import path from "path";
// import { ApolloServer } from "@apollo/server";
// import { resolvers } from "graphql/resolvers";
// import { Filing } from "graphql/models/filing.model";
// import FilingDatasource from "graphql/datasources/filing.datasource";

import { connect } from "lib/database";
import { NextApiRequest, NextApiResponse } from "next";
import { find } from "lib/services/filing.service";

// // load gql type definitions
// const typeDefs = fs.readFileSync(
//   path.join(__dirname, "schema.graphql"),
//   "utf8"
// );

// const connected = await connect();

// const dataSources = () => ({
//   filing: new FilingDatasource({ dbModels: { filings: Filing } }),
// });

// // const server = new ApolloServer({ typeDefs, resolvers, dataSources });
// // const handler = server.createHandler({ path: "/api/graphql" });

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     });
//   });
// }

// const apolloServer = new ApolloServer({ typeDefs, resolvers, dataSources });
// await apolloServer.start();
// const apolloMiddleware = apolloServer.getMiddleware({
//   path: "/api/graphql",
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   await runMiddleware(req, res, apolloMiddleware);
// }

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { keyword = "", actions = "", date = "", page = 1 } = req.query;

  const result = await find(
    keyword as string,
    String(actions).split(","),
    date as string,
    Number(page)
  );

  res.status(200).json(result);
}
