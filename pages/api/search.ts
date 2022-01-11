import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  searchTerm?: string;
  results: any[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // TODO: implement search using lunr
  // https://lunrjs.com/docs/index.html
  res.status(200).json({
    searchTerm: req.body.s,
    results: [],
  });
}
