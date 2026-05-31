'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Slab = {
  id: string
  min_cars: number
  max_cars: number | null
  incentive_per_car: number
}

export default function SlabsPage() {
  const [slabs, setSlabs] = useState<Slab[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Slab | null>(null)
  const [minCars, setMinCars] = useState('')
  const [maxCars, setMaxCars] = useState('')
  const [incentive, setIncentive] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchSlabs() {
    const res = await fetch('/api/slabs')
    const data = await res.json()
    setSlabs(data)
  }

  useEffect(() => { fetchSlabs() }, [])

  function openAdd() {
    setEditing(null)
    setMinCars('')
    setMaxCars('')
    setIncentive('')
    setOpen(true)
  }

  function openEdit(slab: Slab) {
    setEditing(slab)
    setMinCars(String(slab.min_cars))
    setMaxCars(slab.max_cars !== null ? String(slab.max_cars) : '')
    setIncentive(String(slab.incentive_per_car))
    setOpen(true)
  }

  async function handleSave() {
    setLoading(true)
    const body = {
      min_cars: parseInt(minCars),
      max_cars: maxCars === '' ? null : parseInt(maxCars),
      incentive_per_car: parseFloat(incentive),
    }
    if (editing) {
      await fetch(`/api/slabs/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/slabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    setOpen(false)
    setLoading(false)
    fetchSlabs()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/slabs/${id}`, { method: 'DELETE' })
    fetchSlabs()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Incentive Slab Configuration</CardTitle>
        <Button onClick={openAdd}>+ Add Slab</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Min Cars</TableHead>
              <TableHead>Max Cars</TableHead>
              <TableHead>Incentive / Car</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slabs.map(slab => (
              <TableRow key={slab.id}>
                <TableCell>{slab.min_cars}</TableCell>
                <TableCell>{slab.max_cars ?? '∞'}</TableCell>
                <TableCell>₹{Number(slab.incentive_per_car).toLocaleString('en-IN')}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(slab)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(slab.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Slab' : 'Add Slab'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Min Cars</Label>
              <Input type="number" value={minCars} onChange={e => setMinCars(e.target.value)} placeholder="e.g. 1" />
            </div>
            <div className="space-y-2">
              <Label>Max Cars (leave empty for no limit)</Label>
              <Input type="number" value={maxCars} onChange={e => setMaxCars(e.target.value)} placeholder="e.g. 5" />
            </div>
            <div className="space-y-2">
              <Label>Incentive per Car (₹)</Label>
              <Input type="number" value={incentive} onChange={e => setIncentive(e.target.value)} placeholder="e.g. 2000" />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
