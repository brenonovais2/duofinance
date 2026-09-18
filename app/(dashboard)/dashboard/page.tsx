import React from "react";
import { PrismaClient } from "@prisma/client";
import DespesaModal from "@/components/DespesaModal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GerenciarUsuarios from "@/components/GerenciarUsuarios";

// Singleton client for fast refresh during dev
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let usuarios = await prisma.usuario.findMany();
  
  const currentDate = new Date();
  const targetMes = currentDate.getMonth() + 1;
  const targetAno = currentDate.getFullYear();
  const startDate = new Date(targetAno, targetMes - 1, 1);
  const endDate = new Date(targetAno, targetMes, 0, 23, 59, 59, 999);

  const despesas = await prisma.despesa.findMany({
    where: {
      data: {
        gte: startDate,
        lte: endDate,
      }
    },
    include: {
      pagoPor: true
    },
    orderBy: {
      vencimento: 'desc'
    }
  });

  let totalMes = 0;
  let totalPago = 0;
  let pendente = 0;

  // Categórias
  const gastosPorCategoria: Record<string, number> = {
    Mercado: 0,
    Cartões: 0,
    Casa: 0,
    Veículo: 0,
    Outros: 0
  };

  const pagamentosPorUsuario: Record<string, { nome: string, totalPago: number }> = {};
  usuarios.forEach(u => {
    pagamentosPorUsuario[u.id] = { nome: u.nome, totalPago: 0 };
  });

  for (const d of despesas) {
    totalMes += d.valor;
    if (d.statusPago) {
      totalPago += d.valor;
    } else {
      pendente += d.valor;
    }

    if (gastosPorCategoria[d.categoria] !== undefined) {
      gastosPorCategoria[d.categoria] += d.valor;
    } else {
      gastosPorCategoria["Outros"] += d.valor;
    }

    if (pagamentosPorUsuario[d.pagoPorId]) {
      pagamentosPorUsuario[d.pagoPorId].totalPago += d.valor;
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };



  return (
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Acompanhe suas finanças e divida contas facilmente.</p>
          </div>
          <div className="flex gap-3">
            {/* Gestão de Pagantes seria um modal, mas por simplicidade, podemos linkar ou ter outro modal */}
            <DespesaModal usuarios={usuarios} />
          </div>
        </header>

        {/* Resumo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-gray-500 font-medium mb-2">Total do Mês</h3>
            <p className="text-3xl font-bold text-[#0B032D]">{formatCurrency(totalMes)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-gray-500 font-medium mb-2">Total Pago</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-gray-500 font-medium mb-2">Pendente</h3>
            <p className="text-3xl font-bold text-red-500">{formatCurrency(pendente)}</p>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categórias / Tabela de Despesas */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Gastos por Categoria</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(gastosPorCategoria).map(([cat, val]) => (
                  <div key={cat} className="p-4 rounded-xl bg-[#F2F5F7] border border-gray-50 flex flex-col justify-center">
                    <span className="text-sm text-gray-500 font-medium">{cat}</span>
                    <span className="text-lg font-bold text-[#5E2BFF] mt-1">{formatCurrency(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Últimos Lançamentos</h2>
                <Link href="/lancamentos" className="text-sm text-[#5E2BFF] font-medium hover:underline">
                  Ver todos
                </Link>
              </div>
              {despesas.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Nenhuma despesa cadastrada ainda.</p>
              ) : (
                <div className="space-y-4">
                  {despesas.slice(0, 5).map(d => (
                    <div key={d.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-bold text-lg">{d.descricao}</p>
                        <p className="text-sm text-gray-500">{d.categoria} • Pago por {d.pagoPor.nome}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0B032D] text-lg">{formatCurrency(d.valor)}</p>
                        <p className={`text-xs font-bold px-2 py-1 rounded-full mt-1 inline-block ${d.statusPago ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {d.statusPago ? 'Pago' : 'Pendente'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gráfico Placeholder & Stats Pessoais */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#5E2BFF] to-[#3B12B3] p-6 md:p-8 rounded-3xl shadow-lg text-white">
              <h2 className="text-xl font-bold mb-6 text-[#FDB833]">Resumo por Pagante</h2>
              {usuarios.length === 0 ? (
                <p className="text-white/70">Nenhum pagante cadastrado.</p>
              ) : (
                <div className="space-y-6">
                  {Object.values(pagamentosPorUsuario).map((u, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="w-full h-px bg-white/20"></div>}
                      <div>
                        <p className="text-white/70 font-medium mb-1">Total pago por {u.nome}</p>
                        <p className="text-3xl font-bold">{formatCurrency(u.totalPago)}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            
            <GerenciarUsuarios usuarios={usuarios} />
          </div>
        </div>
      </main>
  );
}
