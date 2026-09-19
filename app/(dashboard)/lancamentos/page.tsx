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

  const usuarios = await prisma.usuario.findMany({
    where: { ownerId }
  });
  // Busca as despesas no banco de dados, incluindo o nome de quem pagou
  const despesas = await prisma.despesa.findMany({
    where: { ownerId },
    include: {
      pagoPor: {
        select: { id: true, nome: true }
      }
    },
    orderBy: {
      vencimento: 'desc'
    }
  });

  return <LancamentosClient despesas={despesas} usuarios={usuarios} />;
}
