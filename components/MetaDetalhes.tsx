"use client";

import { useState } from "react";
import { X, ArrowUpRight, ArrowDownRight, Plus, Trash2, Edit } from "lucide-react";
import { registrarTransacaoMeta, deleteTransacaoMeta, deleteMeta } from "@/app/actions/metas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface Transacao {
  id: string;
  valor: number;
  tipo: string;
  data: string | Date;
  descricao?: string | null;
  usuario: {
    id: string;
    nome: string;
  };
}

interface MetaFinanceira {
  id: string;
  titulo: string;
  valorAlvo: number;
  dataAlvo?: string | Date | null;
  transacoes: Transacao[];
}

interface MetaDetalhesProps {
  isOpen: boolean;
  onClose: () => void;
  meta: MetaFinanceira | null;
  usuarios: any[];
  onEdit: (meta: MetaFinanceira) => void;
}

export default function MetaDetalhes({ isOpen, onClose, meta, usuarios, onEdit }: MetaDetalhesProps) {
  const router = useRouter();
  
  // States para o form de nova transação
  const [showNovaTransacao, setShowNovaTransacao] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<"Aporte" | "Retirada">("Aporte");
  const [valor, setValor] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !meta) return null;

  const totalArrecadado = meta.transacoes.reduce((acc, t) => acc + t.valor, 0);
  let progresso = (totalArrecadado / meta.valorAlvo) * 100;
  if (progresso > 100) progresso = 100;

  const handleTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor || !usuarioId) return;

    try {
      setIsLoading(true);
      await registrarTransacaoMeta({
        metaId: meta.id,
        valor: parseFloat(valor),
        tipo: tipoTransacao,
        usuarioId,
        descricao
      });
      
      setValor("");
      setDescricao("");
      setShowNovaTransacao(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar a transação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransacao = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta transação?")) return;
    try {
      await deleteTransacaoMeta(id);
      router.refresh();
    } catch (error) {
      alert("Erro ao excluir transação.");
    }
  };

  const handleDeleteMeta = async () => {
    if (!confirm("Deseja realmente excluir esta meta financeira? Todas as transações serão perdidas.")) return;
    try {
      await deleteMeta(meta.id);
      onClose();
      router.refresh();
    } catch (error) {
      alert("Erro ao excluir meta.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-[#0B032D]">{meta.titulo}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium text-gray-500">
                Alvo: R$ {meta.valorAlvo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-medium text-[#5E2BFF]">
                Atual: R$ {totalArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({progresso.toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(meta)}
              className="p-2 text-gray-400 hover:text-[#5E2BFF] hover:bg-[#5E2BFF]/10 rounded-full transition-colors"
              title="Editar Meta"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDeleteMeta}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Excluir Meta"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-[#0B032D]">Histórico de Transações</h3>
            <button 
              onClick={() => setShowNovaTransacao(!showNovaTransacao)}
              className="bg-[#5E2BFF]/10 text-[#5E2BFF] px-4 py-2 rounded-xl font-semibold hover:bg-[#5E2BFF]/20 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Nova Transação
            </button>
          </div>

          {/* FORM NOVA TRANSAÇÃO */}
          {showNovaTransacao && (
            <form onSubmit={handleTransacao} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTipoTransacao("Aporte")}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors border ${tipoTransacao === "Aporte" ? "bg-green-100 text-green-700 border-green-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                >
                  Fazer Aporte
                </button>
                <button
                  type="button"
                  onClick={() => setTipoTransacao("Retirada")}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors border ${tipoTransacao === "Retirada" ? "bg-red-100 text-red-700 border-red-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                >
                  Fazer Retirada
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Quem realizou?</label>
                  <select
                    required
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Descrição (Opcional)</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5E2BFF]/20 focus:border-[#5E2BFF] outline-none"
                  placeholder="Ex: Décimo terceiro, venda da bike, etc"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNovaTransacao(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-gray-500 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-[#5E2BFF] hover:bg-[#5E2BFF]/90 transition-colors text-sm"
                >
                  {isLoading ? "Salvando..." : "Registrar"}
                </button>
              </div>
            </form>
          )}

          {/* LISTA DE TRANSAÇÕES */}
          <div className="space-y-3">
            {meta.transacoes.length === 0 ? (
              <p className="text-center text-gray-500 py-6">Nenhum aporte ou retirada registrado.</p>
            ) : (
              meta.transacoes.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.tipo === "Aporte" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {t.tipo === "Aporte" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#0B032D]">
                        {t.tipo} {t.descricao ? `- ${t.descricao}` : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(t.data), "dd MMM yyyy", { locale: ptBR })} • Por {t.usuario.nome}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${t.tipo === "Aporte" ? "text-green-600" : "text-red-600"}`}>
                      {t.tipo === "Aporte" ? '+' : '-'} R$ {Math.abs(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button 
                      onClick={() => handleDeleteTransacao(t.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
