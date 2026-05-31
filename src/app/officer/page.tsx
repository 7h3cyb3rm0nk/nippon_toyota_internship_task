'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { calculateIncentive, type ModelEntry, type Slab } from '@/lib/calc'

type Car = {
  id: string
  name: string
  base_suffix: string | null
  variant: string | null
}

export default function OfficerPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [cars, setCars] = useState<Car[]>([])
  const [slabs, setSlabs] = useState<Slab[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function fetchData() {
    const [carsRes, slabsRes, salesRes] = await Promise.all([
      fetch('/api/cars'),
      fetch('/api/slabs'),
      fetch(`/api/sales?month=${month}&year=${year}`),
    ])
    const carsData = await carsRes.json()
    const slabsData = await slabsRes.json()
    const salesData = await salesRes.json()

    setCars(carsData)
    setSlabs(slabsData)

    const q: Record<string, number> = {}
    carsData.forEach((c: Car) => {
      const log = salesData.find((s: any) => s.model_id === c.id)
      q[c.id] = log ? log.quantity_sold : 0
    })
    setQuantities(q)
  }

  useEffect(() => { fetchData() }, [month, year])

  const entries: ModelEntry[] = cars.map(c => ({
    model_id: c.id,
    model_name: c.name,
    quantity: quantities[c.id] ?? 0,
  }))

  const breakdown = calculateIncentive(entries, slabs)

  async function handleSave() {
    setSaving(true)
    await Promise.all(
      cars.map(c =>
        fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model_id: c.id,
            month,
            year,
            quantity_sold: quantities[c.id] ?? 0,
          }),
        })
      )
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <select
          className="border rounded px-3 py-2 bg-background text-foreground"
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
        >
          {months.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 bg-background text-foreground"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cars.map(car => (
              <div key={car.id} className="flex items-center justify-between gap-4">
                <span className="text-sm">{car.name} {car.variant ?? ''}</span>
                <Input
                  type="number"
                  min={0}
                  className="w-24"
                  value={quantities[car.id] ?? 0}
                  onChange={e => setQuantities(prev => ({
                    ...prev,
                    [car.id]: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                />
              </div>
            ))}
            <Button className="w-full mt-4" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Entries'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incentive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Cars Sold</span>
              <span className="font-semibold">{breakdown.total_cars}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slab Hit</span>
              {breakdown.slab_hit ? (
                <Badge>
                  {breakdown.slab_hit.min_cars}–{breakdown.slab_hit.max_cars ?? '∞'} cars
                </Badge>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span>₹{Number(breakdown.incentive_per_car).toLocaleString('en-IN')} / car</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-semibold">Total Payout</span>
              <span className="text-xl font-bold">
                ₹{breakdown.total_incentive.toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
