"use client";

import React, { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectorProps {
  mes: number;
  ano: number;
}

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function MonthYearSelector({ mes, ano }: MonthYearSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback((newMes: number, newAno: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", newMes.toString());
    params.set("ano", newAno.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const handlePrevMonth = () => {
    let newMes = mes - 1;
    let newAno = ano;
    if (newMes < 1) {
      newMes = 12;
      newAno -= 1;
    }
    updateUrl(newMes, newAno);
  };

  const handleNextMonth = () => {
    let newMes = mes + 1;
    let newAno = ano;
    if (newMes > 12) {
      newMes = 1;
      newAno += 1;
    }
    updateUrl(newMes, newAno);
  };

  // Generate an array of years, e.g., current year - 5 to current year + 5
  const currentYear = new Date().getFullYear();
  const anos = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm h-[48px]">
      <button
        onClick={handlePrevMonth}
        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-[#5E2BFF] rounded-lg transition-colors flex items-center justify-center h-full"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center font-medium text-[#0B032D]">
        <select
          value={mes}
          onChange={(e) => updateUrl(parseInt(e.target.value), ano)}
          className="bg-transparent appearance-none cursor-pointer outline-none hover:text-[#5E2BFF] transition-colors text-center font-semibold"
        >
          {meses.map((m, index) => (
            <option key={m} value={index + 1}>
              {m}
            </option>
          ))}
        </select>
        <span className="text-gray-300 mx-1">/</span>
        <select
          value={ano}
          onChange={(e) => updateUrl(mes, parseInt(e.target.value))}
          className="bg-transparent appearance-none cursor-pointer outline-none hover:text-[#5E2BFF] transition-colors text-center font-semibold"
        >
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNextMonth}
        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-[#5E2BFF] rounded-lg transition-colors flex items-center justify-center h-full"
        aria-label="Próximo mês"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
