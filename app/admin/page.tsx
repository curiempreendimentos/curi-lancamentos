'use client'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [imobiliarias, setImobiliarias] = useState<any[]>([])
  const [cads, setCads] = useState<any[]>([])
  const [selecionada, setSelecionada] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const [ri, rc] = await Promise.all([
      fetch('/api/imobiliarias').then(r => r.json()),
      fetch('/api/cads').then(r => r.json()),
    ])
    setImobiliarias(ri)
    setCads(rc)
    setLoading(false)
  }

  async function aprovar(id: string, status: string) {
    await fetch('/api/imobiliarias', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    setToast(status === 'aprovada' ? 'Imobiliária aprovada! Acessos enviados.' : 'Imobiliária rejeitada.')
    setTimeout(() => setToast(''), 4000)
    setSelecionada(null)
    carregar()
  }

  const pendentes = imobiliarias.filter(i => i.status === 'pendente')
  const aprovadas = imobiliarias.filter(i => i.status === 'aprovada')
  const totalCorretores = aprovadas.reduce((s, i) => s + (i.corretores?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Curi Lançamentos</h1>
          <p className="text-sm text-gray-500">Painel admin</p>
        </div>
        <a href="/cadastro" className="text-sm text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50">
          + Link cadastro imobiliária
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {toast && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
            ✓ {toast}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'CADs geradas', valor: cads.length },
            { label: 'Imobiliárias ativas', valor: aprovadas.length },
            { label: 'Corretores ativos', valor: totalCorretores },
          ].map(m => (
            <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{m.label}</p>
              <p className="text-2xl font-medium text-gray-900">{loading ? '—' : m.valor}</p>
            </div>
          ))}
        </div>

        {pendentes.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Aguardando validação ({pendentes.length})</h2>
            {pendentes.map(imob => (
              <div key={imob.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {imob.razao_social?.slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{imob.razao_social}</p>
                  <p className="text-xs text-gray-500">{imob.creci} · {imob.corretores?.length || 0} corretores · {imob.email}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Pendente</span>
                <button onClick={() => setSelecionada(imob)} className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                  Ver
                </button>
              </div>
            ))}
          </div>
        )}

        {selecionada && (
          <div className="bg-white border-2 border-blue-200 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-medium text-gray-900 mb-3">{selecionada.razao_social} — revisão</h2>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div><span className="text-gray-500">CNPJ:</span> {selecionada.cnpj || '—'}</div>
              <div><span className="text-gray-500">CRECI:</span> {selecionada.creci || '—'}</div>
              <div><span className="text-gray-500">Responsável:</span> {selecionada.responsavel || '—'}</div>
              <div><span className="text-gray-500">Email:</span> {selecionada.email || '—'}</div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">CORRETORES</p>
              {selecionada.corretores?.map((c: any) => (
                <div key={c.id} className="flex items-center gap-2 py-1.5 border-b last:border-0 text-sm">
                  <span className="flex-1">{c.nome}</span>
                  <span className="text-gray-500 text-xs">{c.creci}</span>
                  <span className="text-gray-500 text-xs">{c.email}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => aprovar(selecionada.id, 'aprovada')}
                className="bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-2 text-sm hover:bg-green-100">
                ✓ Aprovar e liberar acessos
              </button>
              <button onClick={() => aprovar(selecionada.id, 'rejeitada')}
                className="bg-red-50 text-red-800 border border-red-200 rounded-lg px-4 py-2 text-sm hover:bg-red-100">
                ✕ Rejeitar
              </button>
              <button onClick={() => setSelecionada(null)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                Fechar
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">CADs registradas</h2>
          {cads.length === 0 && !loading && (
            <p className="text-sm text-gray-400 py-4 text-center">Nenhuma CAD ainda</p>
          )}
          {cads.map((cad: any) => {
            const docsTotal = cad.documentos?.length || 5
            const docsEnviados = cad.documentos?.filter((d: any) => d.status !== 'pendente').length || 0
            const completo = docsEnviados === docsTotal
            return (
              <div key={cad.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${completo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {cad.nome1?.slice(0,2).toUpperCase() || 'CL'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{cad.nome1 || 'Cliente'}</p>
                  <p className="text-xs text-gray-500">{docsEnviados}/{docsTotal} docs · {cad.corretor_nome || '—'}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-mono">{cad.codigo}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${completo ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {completo ? 'Completo' : 'Pendente'}
                </span>
              </div>
            )
          })}
        </div>

        {aprovadas.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Imobiliárias aprovadas</h2>
            {aprovadas.map(imob => (
              <div key={imob.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                <div className="w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {imob.razao_social?.slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{imob.razao_social}</p>
                  <p className="text-xs text-gray-500">{imob.corretores?.length || 0} corretores</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Ativa</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
