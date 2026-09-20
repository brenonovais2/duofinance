import React from 'react';

export default function LoadingRelatorios() {
  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-pulse">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Grid Superior: Totais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-40 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Despesas por Categoria */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded bg-gray-200"></div>
          <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl p-4">
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
