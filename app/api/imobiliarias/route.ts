import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imobiliaria, corretores, empreendimento_id } = body
    const { data: novaImob, error: errImob } = await supabaseAdmin
      .from('imobiliarias')
      .insert({ ...imobiliaria, empreendimento_id, status: 'pendente' })
      .select()
      .single()
    if (errImob) throw errImob
    if (corretores?.length > 0) {
      const { error: errCorr } = await supabaseAdmin
        .from('corretores')
        .insert(corretores.map((c: any) => ({ ...c, imobiliaria_id: novaImob.id, status: 'pendente' })))
      if (errCorr) throw errCorr
    }
    return NextResponse.json({ imobiliaria: novaImob, mensagem: 'Cadastro enviado para validação' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('imobiliarias')
    .select('*, corretores(*)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    const { data: imob, error } = await supabaseAdmin
      .from('imobiliarias')
      .update({ status })
      .eq('id', id)
      .select('*, corretores(*)')
      .single()
    if (error) throw error
    if (status === 'aprovada') {
      await supabaseAdmin.from('corretores').update({ status: 'ativo' }).eq('imobiliaria_id', id)
    }
    return NextResponse.json({ imobiliaria: imob })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
