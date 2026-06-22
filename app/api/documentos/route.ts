import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, nome_arquivo, drive_file_id } = await req.json()
    const { data, error } = await supabaseAdmin
      .from('documentos')
      .update({ status, nome_arquivo, drive_file_id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
