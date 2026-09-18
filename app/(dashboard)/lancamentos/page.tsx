import React from "react";
import { PrismaClient } from "@prisma/client";
import LancamentosClient from "./LancamentosClient";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function LancamentosPage() {
  const usuarios = await prisma.usuario.findMany();
  // Busca as despesas no banco de dados, incluindo o nome de quem pagou
  const despesas = await prisma.despesa.findMany({
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
