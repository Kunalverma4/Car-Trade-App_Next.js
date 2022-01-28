import { NextApiRequest, NextApiResponse } from 'next'
import { getModel } from '../../database/getModel'
import { getPaginatedCars } from '../../database/getpaginatedCars'
import { getAsString } from '../../getAsString'

export default async function cars(req: NextApiRequest, res: NextApiResponse) {
  const cars = await getPaginatedCars(req.query)
  res.json(cars)
}
