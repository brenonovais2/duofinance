"use client";

import { useState } from "react";
import { addDespesaRecorrente } from "@/app/actions/recorrentes";

interface Usuario {
  id: string;
  nome: string;
}

export default function DespesaRecorrenteModal({ usuarios, cartoes = [] }: { usuarios: Usuario[], cartoes?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoRateio, setTipoRateio] = useState("50_50");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addDespesaRecorrente(formData);
    setIsOpen(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#5E2BFF] text-white px-4 py-2 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nova Recorrente
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-xl text-[#0B032D] my-8">
            <h2 className="text-2xl font-bold mb-6">Nova Despesa Recorrente</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <input 
                    name="descricao" 
                    type="text" 
                    required 
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
                    placeholder="Ex: Aluguel"
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
                    <option value="Cartões">Cartões</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Dia de Vencimento</label>
                  <input 
                    name="diaVencimento" 
                    type="number"
                    min="1"
                    max="31"
                    required 
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
                    placeholder="Ex: 5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cartão de Crédito</label>
                  <select 
                    name="cartaoId" 
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50 bg-white"
                  >
                    <option value="">Nenhum (Débito/Pix)</option>
                    {cartoes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quem Paga?</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Divisão</label>
                  <select 
                    name="tipoRateio" 
                    value={tipoRateio}
                    onChange={(e) => setTipoRateio(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50 bg-white"
                  >
                    <option value="50_50">50% / 50%</option>
                    <option value="INDIVIDUAL">100% Individual</option>
                    <option value="CUSTOM_PERCENT">Personalizada (%)</option>
                    <option value="CUSTOM_VALUE">Personalizada (R$)</option>
                  </select>
                </div>

                {tipoRateio === "INDIVIDUAL" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">De quem é o gasto?</label>
                    <select 
                      name="beneficiadoId" 
                      required
                      className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50 bg-white"
                    >
                      <option value="">Selecione...</option>
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                      ))}
                    </select>
                  </div>
                )}

                {(tipoRateio === "CUSTOM_PERCENT" || tipoRateio === "CUSTOM_VALUE") && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {tipoRateio === "CUSTOM_PERCENT" ? "Parte de quem pagou (%)" : "Parte de quem pagou (R$)"}
                    </label>
                    <input 
                      name="rateioPagador" 
                      type="number" 
                      step="0.01"
                      required
                      className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5E2BFF]/50"
                      placeholder={tipoRateio === "CUSTOM_PERCENT" ? "Ex: 70" : "Ex: 150.00"}
                    />
                  </div>
                )}
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
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
