"use client";

import { useState, useEffect } from "react";
import { editDespesaAction } from "../app/actions";

interface Usuario {
  id: string;
  nome: string;
}

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  vencimento: Date;
  pagoPorId?: string;
  pagoPor: {
    id: string;
    nome: string;
  };
  totalParcelas?: number | null;
  parcelaAtual?: number | null;
}

export default function EditarDespesaModal({ 
  isOpen, 
  onClose, 
  despesa, 
  usuarios 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  despesa: Despesa | null; 
  usuarios: Usuario[];
}) {
  const [updateFuture, setUpdateFuture] = useState(false);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setUpdateFuture(false);
    }
  }, [isOpen, despesa]);

  if (!isOpen || !despesa) return null;

  // Remove o sufixo de parcela (ex: " (1/5)") para a edição
  const descricaoBase = despesa.descricao.replace(/\s\(\d+\/\d+\)$/, "");
  const formatVencimento = new Date(despesa.vencimento).toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await editDespesaAction(despesa!.id, formData, updateFuture);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl text-[#0B032D] my-8">
        <h2 className="text-2xl font-bold mb-6">Editar Despesa</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <input 
                name="descricao" 
                type="text" 
                required 
                defaultValue={descricaoBase}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
                placeholder="Ex: Supermercado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Valor (R$)</label>
              <input 
                name="valor" 
                type="number" 
                step="0.01" 
                required 
                defaultValue={despesa.valor}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select 
                name="categoria" 
                required
                defaultValue={despesa.categoria}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50 bg-white"
              >
                <option value="Mercado">Mercado</option>
                <option value="Casa">Casa</option>
                <option value="Veículo">Veículo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Vencimento / Data</label>
              <input 
                name="vencimento" 
                type="date" 
                required 
                defaultValue={formatVencimento}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quem Pagou</label>
              <select 
                name="pagoPorId" 
                required
                defaultValue={despesa.pagoPorId || despesa.pagoPor?.id}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50 bg-white"
              >
                <option value="">Selecione...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {despesa.totalParcelas && despesa.totalParcelas > 1 && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Esta é a parcela {despesa.parcelaAtual} de {despesa.totalParcelas}.
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="updateFuture" 
                    checked={!updateFuture}
                    onChange={() => setUpdateFuture(false)}
                    className="w-4 h-4 text-[#5E2BFF] focus:ring-[#5E2BFF]"
                  />
                  <span className="text-sm text-gray-700">Editar apenas esta parcela</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="updateFuture" 
                    checked={updateFuture}
                    onChange={() => setUpdateFuture(true)}
                    className="w-4 h-4 text-[#5E2BFF] focus:ring-[#5E2BFF]"
                  />
                  <span className="text-sm text-gray-700">Editar esta e as parcelas futuras</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#5E2BFF] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
