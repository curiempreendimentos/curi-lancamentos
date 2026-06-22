'use client'
import { useState } from 'react'

export default function CadastroPage() {
  const [corretores, setCorretores] = useState([{ nome: '', creci: '', email: '' }])
  const [form, setForm] = useState({ razao_social: '', cnpj: '', creci: '', responsavel: '', email: '', telefone: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  function addCorretor() {
    setCorretores([...corretores, { nome: '', creci: '', email: '' }])
  }

  function updateCorretor(i: number, campo: string, valor: string) {
    const novos = [...corretores]
    novos[i] = { ...novos[i], [campo]: valor }
    setCorretores(novos)
  }

  async function enviar() {
    setLoading(true)
    try {
      const res = await fetch('/api/imobiliarias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imobiliaria: form,
          corretores: corretores.filter(c => c.nome && c.email),
          empreendimento_id: process.env.NEXT_PUBLIC_EMPREENDIMENTO_ID,
        })
      })
      if (res.ok) setEnviado(true)
    } finally {
      setLoading(false)
    }
  }

  if (enviado) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Cadastro enviado!</h2>
        <p className="text-sm text-gray-500">O coordenador irá analisar e liberar os acessos. Seus corretores receberão o login por email após aprovação.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-xl font-medium text-gray-900">Solicitação de participação</h1>
          <p className="text-sm text-gray-500 mt-1">Lançamento Aurora Igarapé · Curi Empreendimentos</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Dados da imobiliária</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Razão social', 'razao_social', 'col-span-2'],
              ['CNPJ', 'cnpj', ''],
              ['CRECI', 'creci', ''],
              ['Responsável', 'responsavel', ''],
              ['Email', 'email', ''],
              ['Telefone / WhatsApp', 'telefone', ''],
            ].map(([label, campo, extra]) => (
              <div key={campo} className={extra || ''}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input
                  type="text"
                  value={(form as any)[campo]}
                  onChange={e => setForm({ ...form, [campo]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Corretores que vão atuar</h2>
          <p className="text-xs text-gray-400 mb-4">Cada corretor receberá login e senha por email após aprovação.</p>
          {corretores.map((c, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input placeholder="Nome" value={c.nome} onChange={e => updateCorretor(i, 'nome', e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              <input placeholder="CRECI" value={c.creci} onChange={e => updateCorretor(i, 'creci', e.target.value)}
                className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              <input placeholder="Email" value={c.email} onChange={e => updateCorretor(i, 'email', e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
            </div>
          ))}
          <button onClick={addCorretor} className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 mt-1">
            + Adicionar corretor
          </button>
        </div>

        <div className="flex justify-end">
          <button onClick={enviar} disabled={loading}
            className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar solicitação'}
          </button>
        </div>
      </div>
    </div>
  )
}
