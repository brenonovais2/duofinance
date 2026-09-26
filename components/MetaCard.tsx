"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transacao {
  id: string;
  valor: number;
  tipo: string;
  data: string | Date;
}

interface MetaFinanceira {
  id: string;
  titulo: string;
  valorAlvo: number;
  dataAlvo?: string | Date | null;
  fotoCapa?: string | null;
  transacoes: Transacao[];
}

interface MetaCardProps {
  meta: MetaFinanceira;
  onClick: (meta: MetaFinanceira) => void;
}

export default function MetaCard({ meta, onClick }: MetaCardProps) {
  // Calcular total arrecadado
  const totalArrecadado = meta.transacoes.reduce((acc, t) => acc + t.valor, 0);
  
  // Progresso em %
  let progresso = (totalArrecadado / meta.valorAlvo) * 100;
  if (progresso > 100) progresso = 100;
  if (progresso < 0) progresso = 0;

  // Tempo restante
  let tempoRestante = "";
  if (meta.dataAlvo) {
    const dataAlvo = new Date(meta.dataAlvo);
    const hoje = new Date();
    const diffTime = dataAlvo.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      if (diffDays > 30) {
        const meses = Math.floor(diffDays / 30);
        tempoRestante = `${meses} mes${meses > 1 ? 'es' : ''} restante${meses > 1 ? 's' : ''}`;
      } else {
        tempoRestante = `${diffDays} dia${diffDays > 1 ? 's' : ''} restante${diffDays > 1 ? 's' : ''}`;
      }
    } else if (diffDays === 0) {
      tempoRestante = "Vence hoje";
    } else {
      tempoRestante = "Prazo encerrado";
    }
  }

  return (
    <div 
      onClick={() => onClick(meta)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
    >
      {/* Banner de Capa */}
      <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
        {meta.fotoCapa ? (
          <Image 
            src={meta.fotoCapa} 
            alt={meta.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#5E2BFF]/20 to-[#5E2BFF]/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#5E2BFF]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status de Progresso na Foto */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-sm font-bold text-[#0B032D] px-2 py-1 rounded-lg shadow-sm">
          {progresso.toFixed(0)}%
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-[#0B032D] line-clamp-1">{meta.titulo}</h3>
        
        {meta.dataAlvo && (
          <p className="text-xs font-medium text-gray-500 mt-1">
            Alvo: {format(new Date(meta.dataAlvo), "MMM yyyy", { locale: ptBR })} 
            {tempoRestante && ` • ${tempoRestante}`}
          </p>
        )}

        <div className="mt-auto pt-6 space-y-2">
          {/* Valores */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500 font-medium">Arrecadado</p>
              <p className="text-lg font-bold text-[#5E2BFF]">
                R$ {totalArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Alvo</p>
              <p className="text-sm font-semibold text-gray-700">
                R$ {meta.valorAlvo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${progresso >= 100 ? 'bg-green-500' : 'bg-[#5E2BFF]'}`}
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
