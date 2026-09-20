import React from 'react';

export default function LoadingCartoes() {
  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-pulse">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="space-y-8">
        {/* Seus Cartões */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
            <div className="flex gap-2">
              <div className="h-9 w-32 bg-gray-200 rounded-xl"></div>
              <div className="h-9 w-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-48">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100"></div>
                </div>
                <div className="h-6 w-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faturas */}
        <div>
          <div className="h-6 w-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="space-y-2 text-right">
                    <div className="h-3 w-20 bg-gray-100 rounded ml-auto"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
