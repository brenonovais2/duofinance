"use client";

import { useState } from "react";
import { addDespesa } from "../app/actions";

interface Usuario {
  id: string;
  nome: string;
}

export default function DespesaModal({ usuarios }: { usuarios: Usuario[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addDespesa(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#5E2BFF] text-white px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:bg-opacity-90 shadow-lg shadow-[#5E2BFF]/30 flex items-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nova Despesa
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl text-[#0B032D] my-8">
            <h2 className="text-2xl font-bold mb-6">Nova Despesa</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <input 
                    name="descricao" 
                    type="text" 
                    required 
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
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quem Pagou</label>
                  <select 
                    name="pagoPorId" 
                    required
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50 bg-white"
                  >
                    <option value="">Selecione...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  name="statusPago" 
                  id="statusPago"
                  className="w-5 h-5 text-[#5E2BFF] rounded focus:ring-[#5E2BFF]"
                />
                <label htmlFor="statusPago" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Já foi pago?
                </label>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
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
      )}
    </>
  );
}
