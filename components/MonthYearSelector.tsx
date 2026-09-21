"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

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

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateUrl = useCallback((newMes: number, newAno: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", newMes.toString());
    params.set("ano", newAno.toString());
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
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
    <div className="relative flex items-center bg-white border border-gray-100 rounded-full shadow-lg shadow-[#5E2BFF]/5 text-xl" ref={dropdownRef}>
      <button
        onClick={handlePrevMonth}
        className="px-6 py-5 text-gray-400 hover:text-[#5E2BFF] hover:bg-gray-50 rounded-l-full transition-colors flex items-center justify-center h-full"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-4 py-5 text-[#0B032D] hover:text-[#5E2BFF] transition-colors"
      >
        <span className="font-bold min-w-[100px] text-center">{meses[mes - 1]}</span>
        <span className="text-gray-300">/</span>
        <span className="font-bold">{ano}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white border border-gray-100 rounded-3xl shadow-2xl w-80 z-50 overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
          <div className="w-1/2 border-r border-gray-50 max-h-72 overflow-y-auto">
            {meses.map((m, idx) => {
              const isSelected = mes === idx + 1;
              return (
                <button
                  key={m}
                  onClick={() => updateUrl(idx + 1, ano)}
                  className={`w-full text-left px-5 py-4 text-base font-bold transition-colors hover:bg-[#5E2BFF]/10 hover:text-[#5E2BFF] ${isSelected ? "bg-[#5E2BFF] text-white hover:bg-[#5E2BFF] hover:text-white" : "text-gray-600"}`}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <div className="w-1/2 max-h-72 overflow-y-auto bg-[#F2F5F7]">
            {anos.map((a) => {
              const isSelected = ano === a;
              return (
                <button
                  key={a}
                  onClick={() => updateUrl(mes, a)}
                  className={`w-full text-left px-5 py-4 text-base font-bold transition-colors hover:bg-[#5E2BFF]/10 hover:text-[#5E2BFF] ${isSelected ? "bg-[#5E2BFF] text-white hover:bg-[#5E2BFF] hover:text-white" : "text-gray-600"}`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleNextMonth}
        className="px-6 py-5 text-gray-400 hover:text-[#5E2BFF] hover:bg-gray-50 rounded-r-full transition-colors flex items-center justify-center h-full"
        aria-label="Próximo mês"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
}
