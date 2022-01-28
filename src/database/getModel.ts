import { openDB } from '../openDB'

export type Model = {
  make: string
  count: number
  model: string
}

export async function getModel(make: string) {
  const db = await openDB()
  const Model = await db.all<Model[]>(
    `
 SELECT model, count(*) as count
 FROM car
 WHERE make = @make
 GROUP BY model
 `,
    { '@make': make }
  )
  return Model
}
