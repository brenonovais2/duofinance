"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import MetaModal from "@/components/MetaModal";

export default function MetasClient({ initialMetas, usuarios }: { initialMetas: any[], usuarios: any[] }) {
  const [metas, setMetas] = useState(initialMetas);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setMetas(initialMetas);
  }, [initialMetas]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B032D] tracking-tight">Metas Financeiras</h1>
          <p className="text-gray-500 mt-1">
            Acompanhe o progresso dos seus objetivos de longo prazo.
          </p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#5E2BFF] text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-[#5E2BFF]/90 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </div>

      {/* METAS LIST (Empty State for now) */}
      {metas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-[#5E2BFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5E2BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#0B032D] mb-2">Nenhuma meta cadastrada</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Comece criando a primeira meta financeira de vocês, como uma viagem, entrada de um carro ou reserva de emergência.
          </p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="text-[#5E2BFF] font-medium hover:underline"
          >
            Criar primeira meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* We will render the MetaCards here in future commits */}
          {metas.map(meta => (
            <div key={meta.id} className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-lg text-[#0B032D]">{meta.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">Valor alvo: R$ {meta.valorAlvo.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <MetaModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  );
}
