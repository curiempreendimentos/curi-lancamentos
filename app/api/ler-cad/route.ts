import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json()
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
    if (!ANTHROPIC_KEY) return NextResponse.json({ error: 'Chave Anthropic não configurada' }, { status: 500 })
    const prompt = `Você é especialista em leitura de fichas imobiliárias manuscritas. Analise esta CAD e extraia TODOS os dados. Responda APENAS com JSON válido, sem markdown:\n{"ncad":"","quadra":"","lote":"","imobiliaria":"","corretor":"","nome1":"","nasc1":"","cpf1":"","sexo1":"","rg1":"","orgao1":"","nac1":"","prof1":"","end1":"","endnum1":"","bairro1":"","cidade1":"","cep1":"","tel1":"","email1":"","ecivil1":"","regime1":"","nome2":"","nasc2":"","cpf2":"","sexo2":"","rg2":"","orgao2":"","nac2":"","prof2":"","tel2":"","email2":"","ecivil2":"","regime2":"","data":"","hora":""}`
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1500, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: mimeType || 'image/jpeg', data: imageBase64 } }, { type: 'text', text: prompt }] }] })
    })
    const data = await response.json()
    const text = data.content?.find((b: any) => b.type === 'text')?.text || '{}'
    const dados = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json({ dados })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
