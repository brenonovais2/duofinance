"use client";

import React, { useState } from "react";
import { 
  ShoppingCart, 
  Home, 
  Car, 
  CreditCard,
  MoreHorizontal,
  Play,
  Pause,
  Trash2
} from "lucide-react";
import { DespesaRecorrenteType } from "./LancamentosClient";
import DespesaRecorrenteModal from "@/components/DespesaRecorrenteModal";
import { updateDespesaRecorrenteStatus, deleteDespesaRecorrente } from "@/app/actions/recorrentes";

export default function RecorrentesTab({ 
  recorrentes, 
  usuarios,
  cartoes 
}: { 
  recorrentes: DespesaRecorrenteType[], 
  usuarios: { id: string, nome: string }[],
  cartoes: any[]
}) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const novoStatus = currentStatus === "Ativa" ? "Pausada" : "Ativa";
    await updateDespesaRecorrenteStatus(id, novoStatus);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja excluir esta recorrência? Nenhuma despesa já gerada será apagada.")) {
      await deleteDespesaRecorrente(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Despesas Recorrentes</h2>
          <p className="text-gray-500 text-sm mt-1">Gerencie as contas que são lançadas automaticamente todo mês.</p>
        </div>
        <DespesaRecorrenteModal usuarios={usuarios} cartoes={cartoes} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100 text-sm text-gray-500">
                <th className="font-medium py-4 px-6">Descrição</th>
                <th className="font-medium py-4 px-6">Categoria</th>
                <th className="font-medium py-4 px-6">Valor</th>
                <th className="font-medium py-4 px-6">Vencimento (Dia)</th>
                <th className="font-medium py-4 px-6">Status</th>
                <th className="font-medium py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recorrentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Nenhuma despesa recorrente cadastrada.
                  </td>
                </tr>
              ) : (
                recorrentes.map((item) => {
                  const { icon: Icon, color, bg } = getCategoryIcon(item.categoria);
                  const isAtiva = item.status === "Ativa";

                  return (
                    <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors group ${!isAtiva ? 'opacity-60' : ''}`}>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{item.descricao}</span>
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
                        <span className="text-sm font-medium text-gray-900">Dia {item.diaVencimento}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          isAtiva 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleStatus(item.id, item.status)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={isAtiva ? 'Pausar' : 'Ativar'}
                          >
                            {isAtiva ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir Definitivamente">
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
    </div>
  );
}
