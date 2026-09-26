"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { createMeta, updateMeta } from "@/app/actions/metas";
import { useRouter } from "next/navigation";

interface MetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  metaParaEditar?: any;
}

export default function MetaModal({ isOpen, onClose, metaParaEditar }: MetaModalProps) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(metaParaEditar?.titulo || "");
  const [valorAlvo, setValorAlvo] = useState(metaParaEditar?.valorAlvo?.toString() || "");
  const [dataAlvo, setDataAlvo] = useState(
    metaParaEditar?.dataAlvo ? new Date(metaParaEditar.dataAlvo).toISOString().split("T")[0] : ""
  );
  const [fotoCapa, setFotoCapa] = useState(metaParaEditar?.fotoCapa || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !valorAlvo) return;

    try {
      setIsLoading(true);
      const dataToSave = {
        titulo,
        valorAlvo: parseFloat(valorAlvo),
        dataAlvo: dataAlvo ? new Date(`${dataAlvo}T12:00:00Z`) : null,
        fotoCapa: fotoCapa || null,
      };

      if (metaParaEditar) {
        await updateMeta(metaParaEditar.id, dataToSave);
      } else {
        await createMeta(dataToSave);
      }
      
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a meta financeira.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#0B032D]">
            {metaParaEditar ? "Editar Meta" : "Nova Meta Financeira"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Título da Meta *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none transition-all"
              placeholder="Ex: Viagem para a praia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Valor Alvo (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={valorAlvo}
              onChange={(e) => setValorAlvo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Data Alvo (Opcional)
            </label>
            <input
              type="date"
              value={dataAlvo}
              onChange={(e) => setDataAlvo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none transition-all text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              URL da Foto de Capa (Opcional)
            </label>
            <input
              type="url"
              value={fotoCapa}
              onChange={(e) => setFotoCapa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none transition-all"
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>

          <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-[#5E2BFF] hover:bg-[#5E2BFF]/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Salvando..." : "Salvar Meta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
