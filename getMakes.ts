import { openDB } from './src/openDB'

export type Make = {
  make: string
  count: number
}

export async function getMakes() {
  const db = await openDB()
  const makes = await db.all<Make[]>(`
 SELECT make, count(*) as count
 FROM car
 GROUP BY make
 `)
  return makes
}
