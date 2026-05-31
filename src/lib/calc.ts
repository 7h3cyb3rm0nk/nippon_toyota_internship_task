export type Slab = {
  min_cars: number
  max_cars: number | null
  incentive_per_car: number
}

export type ModelEntry = {
  model_id: string
  model_name: string
  quantity: number
}

export type IncentiveBreakdown = {
  total_cars: number
  slab_hit: Slab | null
  incentive_per_car: number
  total_incentive: number
}

export function calculateIncentive(
  entries: ModelEntry[],
  slabs: Slab[]
): IncentiveBreakdown {
  const total_cars = entries.reduce((sum, e) => sum + e.quantity, 0)
  const sorted = [...slabs].sort((a, b) => a.min_cars - b.min_cars)
  const slab_hit = sorted.findLast((s) => total_cars >= s.min_cars) ?? null
  const incentive_per_car = slab_hit?.incentive_per_car ?? 0
  const total_incentive = total_cars * incentive_per_car
  return { total_cars, slab_hit, incentive_per_car, total_incentive }
}
