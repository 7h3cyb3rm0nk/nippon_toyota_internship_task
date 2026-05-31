import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sales_logs')
    .select(`
      id,
      month,
      year,
      quantity_sold,
      officer_id,
      profiles ( full_name),
      car_models (name, variant)
    `)
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })


  return NextResponse.json(data)
}
