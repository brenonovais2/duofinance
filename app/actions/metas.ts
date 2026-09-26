"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// TIPOS
export type CreateMetaDTO = {
  titulo: string;
  valorAlvo: number;
  dataAlvo?: Date | null;
  fotoCapa?: string | null;
};

export type UpdateMetaDTO = Partial<CreateMetaDTO>;

export type CreateTransacaoMetaDTO = {
  metaId: string;
  valor: number; // Positivo para aporte, negativo para retirada
  tipo: "Aporte" | "Retirada";
  usuarioId: string;
  descricao?: string;
};

// METAS FINANCEIRAS
export async function getMetas() {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const metas = await prisma.metaFinanceira.findMany({
    where: { ownerId },
    include: {
      transacoes: {
        include: {
          usuario: true
        },
        orderBy: {
          data: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return metas;
}

export async function createMeta(data: CreateMetaDTO) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const meta = await prisma.metaFinanceira.create({
    data: {
      ownerId,
      titulo: data.titulo,
      valorAlvo: data.valorAlvo,
      dataAlvo: data.dataAlvo,
      fotoCapa: data.fotoCapa
    }
  });

  revalidatePath("/metas");
  return meta;
}

export async function updateMeta(id: string, data: UpdateMetaDTO) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const metaExistente = await prisma.metaFinanceira.findUnique({ where: { id } });
  if (!metaExistente || metaExistente.ownerId !== ownerId) {
    throw new Error("Meta não encontrada ou não autorizada");
  }

  const meta = await prisma.metaFinanceira.update({
    where: { id },
    data: {
      titulo: data.titulo,
      valorAlvo: data.valorAlvo,
      dataAlvo: data.dataAlvo,
      fotoCapa: data.fotoCapa
    }
  });

  revalidatePath("/metas");
  return meta;
}

export async function deleteMeta(id: string) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const metaExistente = await prisma.metaFinanceira.findUnique({ where: { id } });
  if (!metaExistente || metaExistente.ownerId !== ownerId) {
    throw new Error("Meta não encontrada ou não autorizada");
  }

  await prisma.metaFinanceira.delete({
    where: { id }
  });

  revalidatePath("/metas");
}

// TRANSAÇÕES DA META (APORTES E RETIRADAS)
export async function registrarTransacaoMeta(data: CreateTransacaoMetaDTO) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const metaExistente = await prisma.metaFinanceira.findUnique({ where: { id: data.metaId } });
  if (!metaExistente || metaExistente.ownerId !== ownerId) {
    throw new Error("Meta não encontrada ou não autorizada");
  }

  const valorFinal = data.tipo === "Retirada" ? -Math.abs(data.valor) : Math.abs(data.valor);

  const transacao = await prisma.transacaoMeta.create({
    data: {
      ownerId,
      metaId: data.metaId,
      valor: valorFinal,
      tipo: data.tipo,
      usuarioId: data.usuarioId,
      descricao: data.descricao
    }
  });

  revalidatePath("/metas");
  return transacao;
}

export async function deleteTransacaoMeta(id: string) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const transacaoExistente = await prisma.transacaoMeta.findUnique({ where: { id } });
  if (!transacaoExistente || transacaoExistente.ownerId !== ownerId) {
    throw new Error("Transação não encontrada ou não autorizada");
  }

  await prisma.transacaoMeta.delete({
    where: { id }
  });

  revalidatePath("/metas");
}
