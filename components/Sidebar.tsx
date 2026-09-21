"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import GerenciarUsuarios from "@/components/GerenciarUsuarios";

export default function Sidebar({ usuarios = [] }: { usuarios?: { id: string, nome: string }[] }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Visão Geral",
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      name: "Lançamentos",
      href: "/lancamentos",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Cartões",
      href: "/cartoes",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Relatórios",
      href: "/relatorios",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex flex-col flex-shrink-0 z-10">

      {/* Mobile Top Header (Org + User above Logo) */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-100">
        <OrganizationSwitcher hidePersonal={false} />
        <UserButton showName={false} />
      </div>

      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start">
        <Image
          src="/logo.png"
          alt="DuoFinance Logo"
          width={160}
          height={50}
          className="object-contain hidden md:block"
          priority
        />
        <Image
          src="/logo.png"
          alt="DuoFinance Logo"
          width={150}
          height={20}
          className="object-contain block md:hidden"
          priority
        />
      </div>

      {/* Navigation (Horizontal on mobile, Vertical on desktop) */}
      <nav className="flex-1 px-2 md:px-4 py-2 md:py-4 flex flex-row md:flex-col justify-between md:justify-start gap-1 md:gap-2 overflow-x-auto no-scrollbar border-b md:border-none border-gray-100">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl font-semibold transition-colors ${isActive
                ? "bg-[#5E2BFF]/10 text-[#5E2BFF]"
                : "text-gray-500 hover:bg-gray-50 hover:text-[#0B032D]"
                }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          );
        })}

        {/* Gerenciar Usuários renderizado como Aba no Mobile, Item na Sidebar no Desktop */}
        <GerenciarUsuarios usuarios={usuarios} />
      </nav>

      {/* Desktop Bottom Controls (Hidden on Mobile) */}
      <div className="hidden md:flex p-4 border-t border-gray-100 flex-col items-center justify-center md:justify-start gap-4">
        <OrganizationSwitcher hidePersonal={false} />
        <UserButton showName />
      </div>
    </aside>
  );
}

