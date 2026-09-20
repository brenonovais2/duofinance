import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CartoesClient from "./CartoesClient";

export const dynamic = "force-dynamic";

export default async function CartoesPage() {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) redirect("/sign-in");

  const [cartoes, faturas, usuarios] = await Promise.all([
    prisma.cartao.findMany({
      where: { ownerId },
      orderBy: { nome: 'asc' },
      include: { faturas: true }
    }),
    prisma.fatura.findMany({
      where: { ownerId },
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
    }),
    prisma.usuario.findMany({
      where: { ownerId }
    })
  ]);

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
