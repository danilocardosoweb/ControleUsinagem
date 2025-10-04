import { useMemo } from 'react'
import { useSupabase } from '../hooks/useSupabase'

const Dashboard = () => {
  // Dados reais do Supabase
  const { items: pedidos } = useSupabase('pedidos')
  const { items: apontamentos } = useSupabase('apontamentos')
  const { items: paradas } = useSupabase('paradas')
  const { items: maquinas } = useSupabase('maquinas')

  const hojeISO = new Date()
  const dia = hojeISO.toISOString().slice(0, 10) // YYYY-MM-DD

  const stats = useMemo(() => {
    // Produção diária: soma quantidades de apontamentos cujo início é do dia atual
    const prodDiaria = (apontamentos || []).reduce((acc, a) => {
      const ini = a.inicio ? String(a.inicio) : ''
      const d = ini.slice(0, 10)
      const qtd = Number(a.quantidade || 0)
      return acc + (d === dia ? (isNaN(qtd) ? 0 : qtd) : 0)
    }, 0)

    // Tempo de Parada do dia: somar interseções com o dia corrente
    const inicioDia = new Date(`${dia}T00:00:00`)
    const fimDia = new Date(`${dia}T23:59:59.999`)
    const msParadaHoje = (paradas || []).reduce((acc, p) => {
      const iniP = p.inicio ? new Date(p.inicio) : null
      if (!iniP) return acc
      const fimP = p.fim ? new Date(p.fim) : new Date()
      const start = iniP > inicioDia ? iniP : inicioDia
      const end = fimP < fimDia ? fimP : fimDia
      const delta = Math.max(0, end - start)
      return acc + delta
    }, 0)
    const totalMin = Math.floor(msParadaHoje / 60000)
    const hh = String(Math.floor(totalMin / 60)).padStart(2, '0')
    const mm = String(totalMin % 60).padStart(2, '0')
    const tempoParadaFmt = msParadaHoje > 0 ? `${hh}:${mm}` : '-'

    // Ordens: regra solicitada -> Concluída quando SEPARADO >= QTD_PEDIDO
    const concluidas = (pedidos || []).filter(p => {
      const sep = Number(p.separado || 0)
      const qtd = Number(p.qtd_pedido || 0)
      return qtd > 0 && sep >= qtd
    }).length
    const pendentes = (pedidos || []).filter(p => {
      const sep = Number(p.separado || 0)
      const qtd = Number(p.qtd_pedido || 0)
      // pendente quando não atingiu o pedido
      return !(qtd > 0 && sep >= qtd)
    }).length

    // OEE (placeholder simples, até termos paradas e metas)
    const disponibilidade = 0
    const performance = 0
    const qualidade = 0
    const total = 0

    return {
      oee: { disponibilidade, performance, qualidade, total },
      tempoParada: tempoParadaFmt,
      producaoDiaria: prodDiaria,
      ordensCompletadas: concluidas,
      ordensPendentes: pendentes,
    }
  }, [apontamentos, pedidos, paradas, dia])

  const ordensExecucao = useMemo(() => {
    // Agregar apontamentos por pedido (ordemTrabalho = pedido_seq)
    const porPedido = {}
    for (const a of (apontamentos || [])) {
      const seq = String(a.ordem_trabalho || a.pedido_seq || '')
      if (!seq) continue
      const q = Number(a.quantidade || 0)
      if (!porPedido[seq]) porPedido[seq] = { quantidade: 0, ultimo: null }
      porPedido[seq].quantidade += isNaN(q) ? 0 : q
      // guardar o último apontamento para mostrar máquina/operador
      porPedido[seq].ultimo = a
    }

    // Mapa de máquinas (id -> nome visível)
    const mapMaq = new Map()
    for (const m of (maquinas || [])) {
      const nomeVisivel = (m.nome || m.codigo || m.modelo || '').toString() || '-'
      if (m.id) mapMaq.set(String(m.id), nomeVisivel)
      if (m.codigo) mapMaq.set(String(m.codigo), nomeVisivel)
    }

    // Selecionar pedidos que:
    // - têm quantidade apontada > 0
    // - NÃO estão finalizados/concluídos
    // - e quantidade apontada < qtd_pedido (para não aparecer quando já atingiu a meta)
    const statusKey = (s) => String(s || '').toLowerCase()
    const lista = (pedidos || [])
      .filter(p => {
        const seq = String(p.pedido_seq || '')
        const info = porPedido[seq]
        if (!info || info.quantidade <= 0) return false
        const finalizado = ['finalizado','concluido'].includes(statusKey(p.status))
        if (finalizado) return false
        const qtd = Number(p.qtd_pedido || 0)
        return !(qtd > 0 && info.quantidade >= qtd)
      })
      .map(p => {
        const seq = String(p.pedido_seq || '')
        const info = porPedido[seq] || { quantidade: 0 }
        const qtd = Number(p.qtd_pedido || 0)
        const produzidas = info.quantidade
        const progresso = qtd > 0 ? Math.min(Math.round((produzidas / qtd) * 100), 100) : 0
        const ultimo = info.ultimo || {}
        const rawMaq = String(ultimo.maquina || p.operacao_atual || '').trim()
        const maqNome = mapMaq.get(rawMaq) || (/^[0-9a-f-]{8,}$/i.test(rawMaq) ? '-' : (rawMaq || '-'))
        return {
          codigo: p.pedido_seq || p.nro_op || p.id,
          perfil: p.produto,
          maquina: maqNome,
          operador: ultimo.operador || '-',
          progresso,
        }
      })
      .slice(0, 5)
    return lista
  }, [pedidos, apontamentos, maquinas])
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">OEE Total</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.oee.total ? `${stats.oee.total}%` : '-'}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Tempo de Parada</h2>
          <p className="text-3xl font-bold text-yellow-500">{stats.tempoParada}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Produção Diária</h2>
          <p className="text-3xl font-bold text-green-600">{stats.producaoDiaria}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Ordens</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Concluídas</p>
              <p className="text-xl font-bold text-green-600">{stats.ordensCompletadas}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-xl font-bold text-yellow-500">{stats.ordensPendentes}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Componentes do OEE */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Componentes do OEE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Disponibilidade</h3>
            <div className="mt-1 relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div style={{ width: `${stats.oee.disponibilidade}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
              <p className="text-right text-sm font-semibold text-gray-700">{stats.oee.disponibilidade}%</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Performance</h3>
            <div className="mt-1 relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div style={{ width: `${stats.oee.performance}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
              </div>
              <p className="text-right text-sm font-semibold text-gray-700">{stats.oee.performance}%</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Qualidade</h3>
            <div className="mt-1 relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div style={{ width: `${stats.oee.qualidade}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
              <p className="text-right text-sm font-semibold text-gray-700">{stats.oee.qualidade}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ordens em Execução baseadas nos pedidos em_producao */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Ordens em Execução</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máquina</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordensExecucao.map((o, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{o.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.perfil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.maquina}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.operador}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${o.progresso}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"></div>
                      </div>
                      <span className="text-xs font-semibold inline-block text-primary-600">
                        {o.progresso}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {ordensExecucao.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-500">Nenhuma ordem em produção</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
