"use client";

import React, { useState, useMemo } from "react";
import { 
  ShoppingCart, 
  Home, 
  Car, 
  CheckCircle2, 
  Clock, 
  Pencil, 
  Trash2, 
  Filter,
  Plus,
  Search,
  CreditCard,
  MoreHorizontal
} from "lucide-react";
import { toggleDespesaStatus, deleteDespesa } from "../../actions";

// Tipo para receber do Prisma (simplificado)
type Despesa = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  vencimento: Date;
  statusPago: boolean;
  pagoPor: {
    id: string;
    nome: string;
  };
};

export default function LancamentosClient({ despesas, usuarios }: { despesas: Despesa[], usuarios: { id: string, nome: string }[] }) {
  // Estados dos filtros
  const [busca, setBusca] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("MesAtual");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas Categorias");
  const [statusFiltro, setStatusFiltro] = useState("Todos (Status)");
  const [quemPagouFiltro, setQuemPagouFiltro] = useState("Todos (Quem Pagou)");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Mercado": return { icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-100" };
      case "Casa": return { icon: Home, color: "text-orange-500", bg: "bg-orange-100" };
      case "Veículo": return { icon: Car, color: "text-purple-500", bg: "bg-purple-100" };
      case "Cartões": return { icon: CreditCard, color: "text-rose-500", bg: "bg-rose-100" };
      default: return { icon: MoreHorizontal, color: "text-gray-500", bg: "bg-gray-100" };
    }
  };



  // Lógica de Filtros
  const despesasFiltradas = useMemo(() => {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    return despesas.filter(d => {
      // Busca por texto
      if (busca && !d.descricao.toLowerCase().includes(busca.toLowerCase())) return false;

      // Categoria
      if (categoriaFiltro !== "Todas Categorias" && d.categoria !== categoriaFiltro) return false;

      // Status
      if (statusFiltro === "Pago" && !d.statusPago) return false;
      if (statusFiltro === "Pendente" && d.statusPago) return false;

      // Quem Pagou
      if (quemPagouFiltro !== "Todos (Quem Pagou)" && d.pagoPor.nome !== quemPagouFiltro) return false;

      // Período
      const dataDespesa = new Date(d.vencimento);
      if (periodoFiltro === "MesAtual") {
        if (dataDespesa.getMonth() !== mesAtual || dataDespesa.getFullYear() !== anoAtual) return false;
      } else if (periodoFiltro === "MesAnterior") {
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        if (dataDespesa.getMonth() !== mesAnterior || dataDespesa.getFullYear() !== anoAnterior) return false;
      } else if (periodoFiltro === "Personalizado") {
        if (dataInicio && dataDespesa < new Date(dataInicio)) return false;
        if (dataFim && dataDespesa > new Date(dataFim)) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.vencimento).getTime() - new Date(a.vencimento).getTime());
  }, [despesas, busca, categoriaFiltro, statusFiltro, quemPagouFiltro, periodoFiltro, dataInicio, dataFim]);

  // Calcula resumos baseados nas despesas *filtradas* ou totais? Vamos usar filtradas
  const totalLancado = despesasFiltradas.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPago = despesasFiltradas.filter(l => l.statusPago).reduce((acc, curr) => acc + curr.valor, 0);
  const faltaPagar = totalLancado - totalPago;

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleDespesaStatus(id, !currentStatus);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja excluir este lançamento?")) {
      await deleteDespesa(id);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50/50">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lançamentos</h1>
          <p className="text-gray-500 mt-1">O extrato da casa. Acompanhe e gerencie as despesas.</p>
        </div>
        {/* Usamos o DespesaModal em page.tsx ou Layout, aqui mantemos o visual se não houver o botão real,
            mas idealmente o Nova Despesa fica acessível em todo lugar. Como Lançamentos é página interna, 
            vou colocar um aviso ou apenas não renderizar botão redundante. */}
      </header>

      {/* Indicadores de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Lançado (Filtro)</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalLancado)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Quitado</p>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalPago)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Falta Pagar</p>
          <p className="text-3xl font-bold text-rose-600">{formatCurrency(faltaPagar)}</p>
        </div>
      </div>

      {/* Filtros e Controles */}
      <div className="bg-white p-5 rounded-t-3xl shadow-sm border border-gray-100 flex flex-col xl:flex-row items-center gap-4 mb-px">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar lançamentos..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 rounded-xl transition-all outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200">
            <Filter className="w-4 h-4" />
            Filtros
          </div>
          
          <div className="relative flex items-center gap-2">
            <select 
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200 appearance-none pr-10 outline-none"
            >
              <option value="MesAtual">Mês Atual</option>
              <option value="MesAnterior">Mês Anterior</option>
              <option value="Todos">Todos os Períodos</option>
              <option value="Personalizado">Personalizado</option>
            </select>
            
            {periodoFiltro === "Personalizado" && (
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                />
                <span className="text-gray-400">até</span>
                <input 
                  type="date" 
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                />
              </div>
            )}
          </div>
          
          <div className="relative">
            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200 appearance-none pr-10 outline-none"
            >
              <option>Todas Categorias</option>
              <option>Mercado</option>
              <option>Casa</option>
              <option>Veículo</option>
              <option>Cartões</option>
              <option>Outros</option>
            </select>
          </div>

          <div className="relative">
            <select 
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200 appearance-none pr-10 outline-none"
            >
              <option>Todos (Status)</option>
              <option>Pago</option>
              <option>Pendente</option>
            </select>
          </div>

          <div className="relative">
            <select 
              value={quemPagouFiltro}
              onChange={(e) => setQuemPagouFiltro(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200 appearance-none pr-10 outline-none"
            >
              <option>Todos (Quem Pagou)</option>
              {usuarios.map(u => (
                <option key={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white rounded-b-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100 text-sm text-gray-500">
                <th className="font-medium py-4 px-6">Lançamento</th>
                <th className="font-medium py-4 px-6">Categoria</th>
                <th className="font-medium py-4 px-6">Valor</th>
                <th className="font-medium py-4 px-6">Pagador</th>
                <th className="font-medium py-4 px-6">Status</th>
                <th className="font-medium py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {despesasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Nenhum lançamento encontrado. <br/> Adicione uma nova despesa para começar.
                  </td>
                </tr>
              ) : (
                despesasFiltradas.map((item) => {
                  const { icon: Icon, color, bg } = getCategoryIcon(item.categoria);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{item.descricao}</span>
                          <span className="text-sm text-gray-500">{formatDate(item.vencimento)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${bg} ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.categoria}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{formatCurrency(item.valor)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{item.pagoPor.nome}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => handleToggleStatus(item.id, item.statusPago)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            item.statusPago 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                        >
                          {item.statusPago ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {item.statusPago ? 'Pago' : 'Pendente'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleStatus(item.id, item.statusPago)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title={item.statusPago ? 'Marcar como Pendente' : 'Marcar como Pago'}
                          >
                            {item.statusPago ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar (Em breve)">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
