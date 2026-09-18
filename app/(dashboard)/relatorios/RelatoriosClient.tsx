"use client";

import React from "react";
import { DollarSign, PieChart, ArrowRight } from "lucide-react";

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
};

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



      {/* Despesas por Categoria */}
      <div>
        <h2 className="text-xl font-bold text-[#0B032D] mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-gray-400" />
          Gastos por Categoria
        </h2>
        
        {data.categorias.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
            <div className="divide-y divide-gray-50">
              {data.categorias.map((cat, index) => {
                const percentual = (cat.valor / data.totalCasa) * 100;
                return (
                  <div key={index} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-700">{cat.nome}</span>
                        <span className="font-bold text-[#0B032D]">{formatCurrency(cat.valor)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-[#5E2BFF] h-2 rounded-full" 
                          style={{ width: `${percentual}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 max-w-4xl">
            Nenhuma categoria para exibir neste mês.
          </div>
        )}
      </div>
    </main>
  );
}
