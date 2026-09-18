import React from "react";
import { PrismaClient } from "@prisma/client";
import CartoesClient from "./CartoesClient";

const prisma = new PrismaClient();

export default async function CartoesPage() {
  const cartoes = await prisma.cartao.findMany({
    orderBy: { nome: 'asc' },
    include: { faturas: true }
  });

  const faturas = await prisma.fatura.findMany({
    include: {
      cartao: true,
      despesas: {
        orderBy: { data: 'desc' }
      }
    },
    orderBy: [
      { ano: 'desc' },
      { mes: 'desc' }
    ]
  });

  const usuarios = await prisma.usuario.findMany();

  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Cartões</h1>
        <p className="text-gray-500 mt-1">Gerencie as faturas, limites e acompanhe suas despesas de cartão de crédito.</p>
      </header>

      <CartoesClient cartoes={cartoes} faturas={faturas} usuarios={usuarios} />
    </main>
  );
}
