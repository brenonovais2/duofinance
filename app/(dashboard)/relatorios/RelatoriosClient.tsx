"use client";

import React from "react";
import { DollarSign, PieChart, ArrowRight } from "lucide-react";
import MonthYearSelector from "@/components/MonthYearSelector";

type RelatoriosData = {
  mes: number;
  ano: number;
  totalCasa: number;
  usuarios: {
    id: string;
    nome: string;
    totalPago: number;
  }[];
  categorias: {
    nome: string;
    valor: number;
  }[];
  evolucaoMensal?: { mes: string; total: number }[];
  proporcaoAnual?: { nome: string; total: number }[];
};

import { 
  CategoriaDonutChart, 
  EvolucaoMensalBarChart, 
  ProporcaoPagantePieChart 
} from "@/components/GraficosRelatorios";

export default function RelatoriosClient({ data }: { data: RelatoriosData }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const getMesNome = (mes: number) => {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return meses[mes - 1];
  };

  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B032D] tracking-tight">Relatórios</h1>
          <p className="text-gray-500 mt-1">Resumo dos gastos de {getMesNome(data.mes)} de {data.ano}.</p>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <MonthYearSelector mes={data.mes} ano={data.ano} />
        </div>
      </header>

      {/* Grid Superior: Totais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <DollarSign className="w-5 h-5 text-[#5E2BFF]" />
            <h3 className="font-medium">Total da Casa</h3>
          </div>
          <p className="text-3xl font-bold text-[#0B032D]">{formatCurrency(data.totalCasa)}</p>

        </div>

        {data.usuarios.map((u, i) => (
          <div key={u.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#5E2BFF]/10 text-[#5E2BFF]`}>
                {u.nome.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-medium">Pago por {u.nome}</h3>
            </div>
            <p className="text-3xl font-bold text-[#0B032D]">{formatCurrency(u.totalPago)}</p>

          </div>
        ))}
      </div>



      {/* Gráficos Interativos */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 mb-8">
        {/* Despesas por Categoria (Donut) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-xl font-bold text-[#0B032D] mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#5E2BFF]" />
            Gastos por Categoria
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <CategoriaDonutChart data={data.categorias} />
          </div>
        </div>

        {/* Proporção Anual por Pagante (Pie) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-xl font-bold text-[#0B032D] mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#FDB833]" />
            Proporção de Gastos por Pagante (Ano)
          </h2>
          <div className="flex-1 flex items-center justify-center">
            {data.proporcaoAnual ? (
              <ProporcaoPagantePieChart data={data.proporcaoAnual} />
            ) : (
              <p className="text-gray-500 text-center py-10">Carregando...</p>
            )}
          </div>
        </div>
      </div>

      {/* Evolução Mensal (Barras) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-[#0B032D] mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#5E2BFF]" />
          Evolução das Despesas (Ano)
        </h2>
        <div className="w-full">
          {data.evolucaoMensal ? (
            <EvolucaoMensalBarChart data={data.evolucaoMensal} />
          ) : (
            <p className="text-gray-500 text-center py-10">Carregando...</p>
          )}
        </div>
      </div>
    </main>
  );
}
