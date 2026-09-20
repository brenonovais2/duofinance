import React from 'react';

export default function LoadingLancamentos() {
  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50/50 animate-pulse">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Indicadores de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="h-4 w-32 bg-gray-200 rounded-md mb-3"></div>
            <div className="h-8 w-40 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white p-5 rounded-t-3xl shadow-sm border border-gray-100 flex flex-col xl:flex-row items-center gap-4 mb-px">
        <div className="flex-1 w-full h-10 bg-gray-100 rounded-xl"></div>
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white rounded-b-3xl shadow-sm border border-gray-100 overflow-hidden mb-10 p-6">
        <div className="h-8 bg-gray-100 rounded-lg mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl flex items-center px-4"></div>
          ))}
        </div>
      </div>
    </main>
  );
}
