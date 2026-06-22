import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { empreendimento_id, dados, corretor_id } = body
    const { data: emp } = await supabaseAdmin
      .from('empreendimentos').select('prefixo, nome').eq('id', empreendimento_id).single()
    if (!emp) return NextResponse.json({ error: 'Empreendimento não encontrado' }, { status: 404 })
    const { data: ultimaCad } = await supabaseAdmin
      .from('cads').select('numero_seq').eq('empreendimento_id', empreendimento_id)
      .order('numero_seq', { ascending: false }).limit(1).maybeSingle()
    const proximoNum = (ultimaCad?.numero_seq ?? 0) + 1
    const codigo = `${emp.prefixo}-${String(proximoNum).padStart(4, '0')}`
    const pastaNome = `${codigo} — ${dados.nome1 || 'Cliente'}`
    const { data: novaCad, error } = await supabaseAdmin
      .from('cads')
      .insert({ empreendimento_id, corretor_id: corretor_id || null, codigo, numero_seq: proximoNum, drive_pasta_nome: pastaNome, ...dados })
      .select().single()
    if (error) throw error
    const docs = ['rg_cnh', 'cpf', 'comprovante_residencia', 'comprovante_renda', 'estado_civil']
    await supabaseAdmin.from('documentos').insert(docs.map(tipo => ({ cad_id: novaCad.id, tipo, status: 'pendente' })))
    return NextResponse.json({ cad: novaCad, codigo, pastaNome })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const emp_id = searchParams.get('empreendimento_id')
  let query = supabaseAdmin.from('cads').select('*, documentos(*)').order('numero_seq', { ascending: false })
  if (emp_id) query = query.eq('empreendimento_id', emp_id)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
