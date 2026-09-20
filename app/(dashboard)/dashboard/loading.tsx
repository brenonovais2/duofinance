import React from 'react';

export default function Loading() {
  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
            <div className="h-4 w-24 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-8 w-36 bg-gray-200 rounded-lg mt-auto"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-64">
            <div className="h-6 w-48 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
               ))}
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
             <div className="h-6 w-48 bg-gray-200 rounded-lg mb-6"></div>
             <div className="space-y-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-64">
            <div className="h-6 w-40 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
               <div className="h-12 bg-gray-100 rounded-xl"></div>
               <div className="h-12 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
