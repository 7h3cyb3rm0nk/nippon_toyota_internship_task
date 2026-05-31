'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Car = {
  id: string
  name: string
  variant: string | null
}

type Slab = {
  id: string
  model_id: string
  min_cars: number
  max_cars: number | null
  incentive_per_car: number
  car_models?: {
    id: string
    name: string
    variant: string | null
  }
}

export default function SlabsPage() {
  const [slabs, setSlabs] = useState<Slab[]>([])
  const [cars, setCars] = useState<Car[]>([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Slab | null>(null)

  const [modelId, setModelId] = useState('')
  const [minCars, setMinCars] = useState('')
  const [maxCars, setMaxCars] = useState('')
  const [incentive, setIncentive] = useState('')

  const [loading, setLoading] = useState(false)

  async function fetchData() {
    const [slabsRes, carsRes] = await Promise.all([
      fetch('/api/slabs'),
      fetch('/api/cars'),
    ])

    const slabsData = await slabsRes.json()
    const carsData = await carsRes.json()

    setSlabs(slabsData)
    setCars(carsData)
  }

  function getSlabWarnings(slabs: Slab[]): string[] {
    const warnings: string[] = []

    const grouped = slabs.reduce<Record<string, Slab[]>>((acc, slab) => {
      if (!acc[slab.model_id]) acc[slab.model_id] = []
      acc[slab.model_id].push(slab)
      return acc
    }, {})

    for (const modelSlabs of Object.values(grouped)) {
      const sorted = [...modelSlabs].sort(
        (a, b) => a.min_cars - b.min_cars
      )

      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = sorted[i]
        const next = sorted[i + 1]

        const modelName =
          curr.car_models?.name ?? curr.model_id

        if (curr.max_cars === null) {
          warnings.push(
            `${modelName}: slab ${curr.min_cars}+ has no max but is not the last slab`
          )
          continue
        }

        if (next.min_cars <= curr.max_cars) {
          warnings.push(
            `${modelName}: overlap between ${curr.min_cars}-${curr.max_cars} and ${next.min_cars}-${next.max_cars ?? '∞'}`
          )
        } else if (next.min_cars > curr.max_cars + 1) {
          warnings.push(
            `${modelName}: gap between ${curr.max_cars + 1} and ${next.min_cars - 1}`
          )
        }
      }
    }

    return warnings
  }

  useEffect(() => {
    fetchData()
  }, [])

  function openAdd() {
    setEditing(null)
    setModelId('')
    setMinCars('')
    setMaxCars('')
    setIncentive('')
    setOpen(true)
  }

  function openEdit(slab: Slab) {
    setEditing(slab)

    setModelId(slab.model_id)
    setMinCars(String(slab.min_cars))
    setMaxCars(
      slab.max_cars !== null
        ? String(slab.max_cars)
        : ''
    )
    setIncentive(String(slab.incentive_per_car))

    setOpen(true)
  }

  async function handleSave() {
    if (!modelId) return

    setLoading(true)

    const body = {
      model_id: modelId,
      min_cars: parseInt(minCars),
      max_cars: maxCars === '' ? null : parseInt(maxCars),
      incentive_per_car: parseFloat(incentive),
    }

    if (editing) {
      await fetch(`/api/slabs/${editing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/slabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    }

    setOpen(false)
    setLoading(false)

    fetchData()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/slabs/${id}`, {
      method: 'DELETE',
    })

    fetchData()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Incentive Slab Configuration
        </CardTitle>

        <Button onClick={openAdd}>
          + Add Slab
        </Button>
      </CardHeader>

      <CardContent>
        {getSlabWarnings(slabs).map((warning, i) => (
          <div
            key={i}
            className="mb-4 text-sm text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2"
          >
            ⚠ {warning}
          </div>
        ))}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Min Cars</TableHead>
              <TableHead>Max Cars</TableHead>
              <TableHead>Incentive / Car</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {slabs.map(slab => (
              <TableRow key={slab.id}>
                <TableCell>
                  {slab.car_models?.name}
                  {slab.car_models?.variant
                    ? ` ${slab.car_models.variant}`
                    : ''}
                </TableCell>

                <TableCell>
                  {slab.min_cars}
                </TableCell>

                <TableCell>
                  {slab.max_cars ?? '∞'}
                </TableCell>

                <TableCell>
                  ₹
                  {Number(
                    slab.incentive_per_car
                  ).toLocaleString('en-IN')}
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(slab)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleDelete(slab.id)
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? 'Edit Slab'
                : 'Add Slab'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Model</Label>

              <select
                className="w-full border rounded px-3 py-2 bg-background"
                value={modelId}
                onChange={e =>
                  setModelId(e.target.value)
                }
              >
                <option value="">
                  Select model
                </option>

                {cars.map(car => (
                  <option
                    key={car.id}
                    value={car.id}
                  >
                    {car.name}
                    {car.variant
                      ? ` ${car.variant}`
                      : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Min Cars</Label>

              <Input
                type="number"
                value={minCars}
                onChange={e =>
                  setMinCars(e.target.value)
                }
                placeholder="e.g. 1"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Max Cars (leave empty for no
                limit)
              </Label>

              <Input
                type="number"
                value={maxCars}
                onChange={e =>
                  setMaxCars(e.target.value)
                }
                placeholder="e.g. 5"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Incentive per Car (₹)
              </Label>

              <Input
                type="number"
                value={incentive}
                onChange={e =>
                  setIncentive(e.target.value)
                }
                placeholder="e.g. 2000"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
