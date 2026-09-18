"use client";

import React, { useState } from "react";
import { CreditCard, Plus, FileText, ChevronDown, CheckCircle2, Circle, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { Cartao, Fatura, Despesa } from "@prisma/client";
import { addCartao, updateFaturaStatus, addDespesaParcelada, updateCartao, updateDespesa, deleteDespesa } from "@/app/actions/cartoes";

type FaturaComDetalhes = Fatura & { cartao: Cartao, despesas: Despesa[] };

interface CartoesClientProps {
  cartoes: Cartao[];
  faturas: FaturaComDetalhes[];
  usuarios: { id: string, nome: string }[];
}

export default function CartoesClient({ cartoes, faturas, usuarios }: CartoesClientProps) {
  const [isNovoCartaoOpen, setIsNovoCartaoOpen] = useState(false);
  const [faturaExpandida, setFaturaExpandida] = useState<string | null>(null);
  const [isNovaCompraOpen, setIsNovaCompraOpen] = useState(false);
  const [cartaoEditando, setCartaoEditando] = useState<Cartao | null>(null);
  const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta": return "text-blue-500 bg-blue-50 border-blue-200";
      case "Fechada": return "text-amber-500 bg-amber-50 border-amber-200";
      case "Paga": return "text-green-500 bg-green-50 border-green-200";
      default: return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberta": return <Circle className="w-4 h-4" />;
      case "Fechada": return <AlertCircle className="w-4 h-4" />;
      case "Paga": return <CheckCircle2 className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (faturaId: string, novoStatus: string) => {
    await updateFaturaStatus(faturaId, novoStatus);
  };

  return (
    <div className="space-y-8">
      {/* Resumo de Cartões */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Seus Cartões</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsNovaCompraOpen(true)}
              disabled={cartoes.length === 0}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Nova Compra
            </button>
            <button 
              onClick={() => setIsNovoCartaoOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Cartão
            </button>
          </div>
        </div>
        
        {cartoes.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">Nenhum cartão cadastrado</h3>
            <p className="text-gray-500 text-sm">Adicione seu primeiro cartão para começar a controlar as faturas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartoes.map(cartao => (
              <div key={cartao.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => setCartaoEditando(cartao)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar Cartão"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{cartao.nome}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Limite</span>
                    <span className="font-medium text-gray-900">
                      {cartao.limite ? `R$ ${cartao.limite.toFixed(2)}` : 'Não definido'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fechamento</span>
                    <span className="font-medium text-gray-900">Dia {cartao.diaFechamento}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vencimento</span>
                    <span className="font-medium text-gray-900">Dia {cartao.diaVencimento}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faturas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Faturas</h2>
        {faturas.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center">
            <p className="text-gray-500 text-sm">Ainda não há faturas geradas para os cartões.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faturas.map(fatura => {
              const totalFatura = fatura.despesas.reduce((acc, d) => acc + d.valor, 0);
              const isExpanded = faturaExpandida === fatura.id;
              
              return (
                <div key={fatura.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setFaturaExpandida(isExpanded ? null : fatura.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{fatura.cartao.nome}</h4>
                        <p className="text-sm text-gray-500">Ref: {fatura.mes.toString().padStart(2, '0')}/{fatura.ano}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total da Fatura</p>
                        <p className="font-semibold text-gray-900">R$ {totalFatura.toFixed(2)}</p>
                      </div>
                      
                      <div 
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(fatura.status)}`}
                        onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking status
                      >
                        {getStatusIcon(fatura.status)}
                        <select 
                          className="bg-transparent outline-none cursor-pointer appearance-none pr-1"
                          value={fatura.status}
                          onChange={(e) => handleStatusChange(fatura.id, e.target.value)}
                        >
                          <option value="Aberta">Aberta</option>
                          <option value="Fechada">Fechada</option>
                          <option value="Paga">Paga</option>
                        </select>
                      </div>
                      
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="bg-gray-50 p-5 border-t border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Lançamentos da Fatura</h5>
                      {fatura.despesas.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum lançamento nesta fatura.</p>
                      ) : (
                        <div className="space-y-2">
                          {fatura.despesas.map(despesa => (
                            <div key={despesa.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{despesa.descricao}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(despesa.data).toLocaleDateString('pt-BR')} 
                                  {despesa.parcelaAtual && despesa.totalParcelas && 
                                    <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-bold">
                                      {despesa.parcelaAtual}/{despesa.totalParcelas}
                                    </span>
                                  }
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-900">R$ {despesa.valor.toFixed(2)}</span>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => setDespesaEditando(despesa)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={async () => {
                                    if(confirm('Tem certeza que deseja excluir este lançamento?')) {
                                      await deleteDespesa(despesa.id);
                                    }
                                  }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Novo Cartão */}
      {isNovoCartaoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Novo Cartão</h3>
            </div>
            <form action={async (formData) => {
              await addCartao(formData);
              setIsNovoCartaoOpen(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cartão</label>
                <input required type="text" name="nome" placeholder="Ex: Nubank do Breno" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limite (Opcional)</label>
                <input type="number" step="0.01" name="limite" placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Fechamento</label>
                  <input required type="number" min="1" max="31" name="diaFechamento" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Vencimento</label>
                  <input required type="number" min="1" max="31" name="diaVencimento" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsNovoCartaoOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium rounded-xl transition-colors">
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Compra */}
      {isNovaCompraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Lançar no Cartão</h3>
            </div>
            <form action={async (formData) => {
              const cartaoId = formData.get("cartaoId") as string;
              if (cartaoId) {
                await addDespesaParcelada(formData, cartaoId);
                setIsNovaCompraOpen(false);
              }
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cartão</label>
                <select required name="cartaoId" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="">Selecione um cartão...</option>
                  {cartoes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input required type="text" name="descricao" placeholder="Ex: Compra no Mercado Livre" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                  <input required type="number" step="0.01" name="valorTotal" placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                  <input required type="number" min="1" max="48" name="parcelas" defaultValue="1" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra</label>
                  <input required type="date" name="data" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pago Por</label>
                  <select name="pagoPorId" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsNovaCompraOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium rounded-xl transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Cartão */}
      {cartaoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Editar Cartão</h3>
            </div>
            <form action={async (formData) => {
              await updateCartao(cartaoEditando.id, formData);
              setCartaoEditando(null);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cartão</label>
                <input required type="text" name="nome" defaultValue={cartaoEditando.nome} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limite (Opcional)</label>
                <input type="number" step="0.01" name="limite" defaultValue={cartaoEditando.limite || ""} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Fechamento</label>
                  <input required type="number" min="1" max="31" name="diaFechamento" defaultValue={cartaoEditando.diaFechamento} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Vencimento</label>
                  <input required type="number" min="1" max="31" name="diaVencimento" defaultValue={cartaoEditando.diaVencimento} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setCartaoEditando(null)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium rounded-xl transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Despesa */}
      {despesaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Editar Lançamento</h3>
            </div>
            <form action={async (formData) => {
              await updateDespesa(despesaEditando.id, formData);
              setDespesaEditando(null);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input required type="text" name="descricao" defaultValue={despesaEditando.descricao} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input required type="number" step="0.01" name="valor" defaultValue={despesaEditando.valor} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setDespesaEditando(null)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium rounded-xl transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
