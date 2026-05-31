'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Car = {
  id: string
  name: string
  base_suffix: string | null
  variant: string | null
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Car | null>(null)
  const [name, setName] = useState('')
  const [baseSuffix, setBaseSuffix] = useState('')
  const [variant, setVariant] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchCars() {
    const res = await fetch('/api/cars')
    const data = await res.json()
    setCars(data)
  }

  useEffect(() => { fetchCars() }, [])

  function openAdd() {
    setEditing(null)
    setName('')
    setBaseSuffix('')
    setVariant('')
    setOpen(true)
  }

  function openEdit(car: Car) {
    setEditing(car)
    setName(car.name)
    setBaseSuffix(car.base_suffix ?? '')
    setVariant(car.variant ?? '')
    setOpen(true)
  }

  async function handleSave() {
    setLoading(true)
    const body = { name, base_suffix: baseSuffix, variant }
    if (editing) {
      await fetch(`/api/cars/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    setOpen(false)
    setLoading(false)
    fetchCars()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    fetchCars()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Car Models</CardTitle>
        <Button onClick={openAdd}>+ Add Car</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Base Suffix</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map(car => (
              <TableRow key={car.id}>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.base_suffix ?? '-'}</TableCell>
                <TableCell>{car.variant ?? '-'}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(car)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(car.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Car' : 'Add Car'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Innova" />
            </div>
            <div className="space-y-2">
              <Label>Base Suffix</Label>
              <Input value={baseSuffix} onChange={e => setBaseSuffix(e.target.value)} placeholder="e.g. GL" />
            </div>
            <div className="space-y-2">
              <Label>Variant</Label>
              <Input value={variant} onChange={e => setVariant(e.target.value)} placeholder="e.g. 7-seater" />
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
