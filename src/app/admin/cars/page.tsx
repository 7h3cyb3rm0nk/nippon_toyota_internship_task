'use client'

import { useEffect, useState, useCallback } from 'react'
import { Car, Plus, Pencil, Trash2 } from 'lucide-react'
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

  const fetchCars = useCallback(async () => {
    const res = await fetch('/api/cars')
    const data = await res.json()
    setCars(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

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
    if (!confirm('Are you sure you want to delete this car?')) return
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    fetchCars()
  }

  return (
    <Card className="shadow-none border-border">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border p-6">
        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <Car className="size-6 text-primary" />
          Car Models
        </CardTitle>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="size-4" />
          Add Car
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Base Suffix</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map(car => (
              <TableRow key={car.id}>
                <TableCell className="font-medium">{car.name}</TableCell>
                <TableCell>{car.base_suffix ?? '-'}</TableCell>
                <TableCell>{car.variant ?? '-'}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(car)}>
                    <Pencil className="size-4 text-muted-foreground hover:text-primary" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(car.id)}>
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
            <DialogTitle>{editing ? 'Edit Car' : 'Add New Car'}</DialogTitle>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
