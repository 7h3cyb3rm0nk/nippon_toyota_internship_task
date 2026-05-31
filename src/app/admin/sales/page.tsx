'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type SalesLog = {
  id: string
  month: number
  year: number
  quantity_sold: number
  officer_id: string
  profiles: { full_name: string | null }
  car_models: { name: string; variant: string | null }
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export default function AdminSalesPage() {
  const [logs, setLogs] = useState<SalesLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/sales')
      .then(r => r.json())
      .then(data => { setLogs(data); setLoading(false) })
  }, [])

  // Group by officer + month + year
  const grouped = logs.reduce((acc, log) => {
    const key = `${log.officer_id}-${log.month}-${log.year}`
    if (!acc[key]) {
      acc[key] = {
        officer: log.profiles?.full_name ?? 'Unknown',
        month: log.month,
        year: log.year,
        total_cars: 0,
        models: [],
      }
    }
    acc[key].total_cars += log.quantity_sold
    acc[key].models.push(`${log.car_models?.name} ${log.car_models?.variant ?? ''}`.trim())
    return acc
  }, {} as Record<string, { officer: string; month: number; year: number; total_cars: number; models: string[] }>)

  const rows = Object.values(grouped)

  return (
    <Card className="shadow-none border-border">
      <CardHeader className="border-b border-border p-6">
        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <ShoppingCart className="size-6 text-primary" />
          All Officer Sales
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <p className="p-6 text-muted-foreground">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-muted-foreground">No sales logged yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Officer</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Total Cars</TableHead>
                <TableHead>Models</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.officer}</TableCell>
                  <TableCell>{months[row.month - 1]} {row.year}</TableCell>
                  <TableCell className="font-bold">{row.total_cars}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.models.map((m, j) => (
                        <Badge key={j} variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
