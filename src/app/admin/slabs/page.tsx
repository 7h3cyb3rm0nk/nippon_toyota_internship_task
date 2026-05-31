'use client'

import { useEffect, useState, useCallback } from 'react'
import { TableProperties, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

  function getSlabWarnings(slabs: Slab[]): string[] {
    const warnings: string[] = []
    const grouped = slabs.reduce<Record<string, Slab[]>>((acc, slab) => {
      if (!acc[slab.model_id]) acc[slab.model_id] = []
      acc[slab.model_id].push(slab)
      return acc
    }, {})

    for (const modelSlabs of Object.values(grouped)) {
      const sorted = [...modelSlabs].sort((a, b) => a.min_cars - b.min_cars)
      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = sorted[i]
        const next = sorted[i + 1]
        const modelName = curr.car_models?.name ?? curr.model_id
        if (curr.max_cars === null) {
          warnings.push(`${modelName}: slab ${curr.min_cars}+ has no max but is not the last slab`)
          continue
        }
        if (next.min_cars <= curr.max_cars) {
          warnings.push(`${modelName}: overlap between ${curr.min_cars}-${curr.max_cars} and ${next.min_cars}-${next.max_cars ?? '∞'}`)
        } else if (next.min_cars > curr.max_cars + 1) {
          warnings.push(`${modelName}: gap between ${curr.max_cars + 1} and ${next.min_cars - 1}`)
        }
      }
    }
    return warnings
  }

  const fetchData = useCallback(async () => {
    const [slabsRes, carsRes] = await Promise.all([fetch('/api/slabs'), fetch('/api/cars')])
    setSlabs(await slabsRes.json())
    setCars(await carsRes.json())
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

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
    setMaxCars(slab.max_cars !== null ? String(slab.max_cars) : '')
    setIncentive(String(slab.incentive_per_car))
    setOpen(true)
  }

  async function handleSave() {
    if (!modelId) return
    setLoading(true)
    const body = { model_id: modelId, min_cars: parseInt(minCars), max_cars: maxCars === '' ? null : parseInt(maxCars), incentive_per_car: parseFloat(incentive) }
    if (editing) {
      await fetch(`/api/slabs/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch('/api/slabs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setOpen(false)
    setLoading(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return
    await fetch(`/api/slabs/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <Card className="shadow-none border-border">
      <CardHeader className="border-b border-border p-6 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <TableProperties className="size-6 text-primary" />
          Incentive Slab Configuration
        </CardTitle>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="size-4" />
          Add Slab
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {getSlabWarnings(slabs).map((warning, i) => (
          <div key={i} className="m-6 mb-0 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
            ⚠ {warning}
          </div>
        ))}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Model</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Incentive / Car</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slabs.map(slab => (
              <TableRow key={slab.id}>
                <TableCell className="font-medium">
                  {slab.car_models?.name} {slab.car_models?.variant ?? ''}
                </TableCell>
                <TableCell>{slab.min_cars}</TableCell>
                <TableCell>{slab.max_cars ?? '∞'}</TableCell>
                <TableCell className="font-bold">₹{Number(slab.incentive_per_car).toLocaleString('en-IN')}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(slab)}>
                    <Pencil className="size-4 text-muted-foreground hover:text-primary" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(slab.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Slab' : 'Add New Slab'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map(car => (
                    <SelectItem key={car.id} value={car.id}>{car.name} {car.variant ?? ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Min Cars</Label>
                    <Input type="number" value={minCars} onChange={e => setMinCars(e.target.value)} placeholder="1" />
                </div>
                <div className="space-y-2">
                    <Label>Max Cars</Label>
                    <Input type="number" value={maxCars} onChange={e => setMaxCars(e.target.value)} placeholder="None" />
                </div>
            </div>
            <div className="space-y-2">
              <Label>Incentive per Car (₹)</Label>
              <Input type="number" value={incentive} onChange={e => setIncentive(e.target.value)} placeholder="2000" />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
