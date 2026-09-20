import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LancamentosClient from "./LancamentosClient";

export const dynamic = "force-dynamic";

export default async function LancamentosPage() {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) redirect("/sign-in");

  // Busca os dados no banco de dados em paralelo
  const [usuarios, despesas] = await Promise.all([
    prisma.usuario.findMany({
      where: { ownerId }
    }),
    prisma.despesa.findMany({
      where: { ownerId },
      include: {
        pagoPor: {
          select: { id: true, nome: true }
        }
      },
      orderBy: {
        vencimento: 'desc'
      }
    })
  ]);

  return <LancamentosClient despesas={despesas} usuarios={usuarios} />;
}
