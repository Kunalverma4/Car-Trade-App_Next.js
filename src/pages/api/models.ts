import { NextApiRequest, NextApiResponse } from 'next'
import { getModel } from '../../database/getModel'
import { getAsString } from '../../getAsString'

export default async function models(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const make = getAsString(req.query.make)
  const models = await getModel(make)
  res.json(models)
}
