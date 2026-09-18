import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#F2F5F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 md:p-14 rounded-[32px] shadow-sm max-w-lg w-full flex flex-col items-center border border-gray-100">
        <Image
          src="/logo.png"
          alt="DuoFinance Logo"
          width={180}
          height={60}
          className="mb-8 object-contain"
          priority
        />
        
        <h1 className="text-3xl font-bold text-[#0B032D] mb-4 tracking-tight">
          Bem-vindo(a) ao DuoFinance
        </h1>
        
        <p className="text-gray-500 mb-10 leading-relaxed text-lg">
          Gerencie os gastos da casa, divida as contas de forma justa e tenha um balanço inteligente todo mês.
        </p>

        <Link
          href="/dashboard"
          className="w-full bg-[#5E2BFF] text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-[#4d1fdf] transition-colors shadow-md shadow-[#5E2BFF]/20"
        >
          Iniciar
        </Link>
      </div>
    </main>
  );
}
