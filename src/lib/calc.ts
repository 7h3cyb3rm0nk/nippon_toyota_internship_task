export type Slab = {
  model_id: string
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
  total_incentive: number
  models: ModelBreakDown[]
}

export type ModelBreakDown = {
  model_id: string
  model_name: string
  quantity: number
  slab_hit: Slab | null
  incentive_per_car: number
  total_incentive: number

}


export function calculateIncentive(
  entries: ModelEntry[],
  slabs: Slab[]
): IncentiveBreakdown {
  const models: ModelBreakDown[] = []

  let total_cars = 0
  let total_incentive = 0

  for (const entry of entries) {
    total_cars += entry.quantity

    const modelSlabs = slabs
      .filter((s) => s.model_id === entry.model_id)
      .sort((a, b) => a.min_cars - b.min_cars)

    const slab_hit =
      modelSlabs.findLast(
        (s) => entry.quantity >= s.min_cars
      ) ?? null

    const incentive_per_car =
      slab_hit?.incentive_per_car ?? 0

    const model_incentive =
      incentive_per_car * entry.quantity

    total_incentive += model_incentive

    models.push({
      model_id: entry.model_id,
      model_name: entry.model_name,
      quantity: entry.quantity,
      slab_hit,
      incentive_per_car,
      total_incentive: model_incentive,
    })
  }

  return {
    total_cars,
    total_incentive,
    models,
  }
}
