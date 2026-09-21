"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addDespesa(formData: FormData) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  
  const categoria = formData.get("categoria") as string || "Outros";
  const vencimentoStr = formData.get("vencimento") as string;
  const vencimento = vencimentoStr ? new Date(vencimentoStr) : new Date();
  const statusPago = formData.get("statusPago") === "on";

  await prisma.despesa.create({
    data: {
      ownerId,
      descricao,
      valor,
      pagoPorId,
      categoria,
      vencimento,
      statusPago,
    },
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function toggleDespesaStatus(id: string, statusPago: boolean) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  await prisma.despesa.updateMany({
    where: { id, ownerId },
    data: { statusPago }
  });
  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function deleteDespesa(id: string) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  await prisma.despesa.deleteMany({
    where: { id, ownerId }
  });
  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function editDespesaAction(id: string, formData: FormData, updateFuture: boolean) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  const categoria = formData.get("categoria") as string || "Outros";
  const vencimentoStr = formData.get("vencimento") as string;
  const vencimento = vencimentoStr ? new Date(vencimentoStr) : new Date();

  const despesaAtual = await prisma.despesa.findFirst({
    where: { id, ownerId }
  });

  if (!despesaAtual) throw new Error("Despesa não encontrada");

  if (updateFuture && despesaAtual.totalParcelas && despesaAtual.totalParcelas > 1) {
    // Buscar parcelas futuras (incluindo a atual)
    let futuras: any[] = [];
    
    if (despesaAtual.grupoParcelamentoId) {
      futuras = await prisma.despesa.findMany({
        where: {
          ownerId,
          grupoParcelamentoId: despesaAtual.grupoParcelamentoId,
          parcelaAtual: { gte: despesaAtual.parcelaAtual! }
        },
        orderBy: { parcelaAtual: 'asc' }
      });
    } else {
      // Fallback para dados legados sem grupoParcelamentoId
      futuras = await prisma.despesa.findMany({
        where: {
          ownerId,
          cartaoId: despesaAtual.cartaoId,
          data: despesaAtual.data,
          totalParcelas: despesaAtual.totalParcelas,
          parcelaAtual: { gte: despesaAtual.parcelaAtual! }
        },
        orderBy: { parcelaAtual: 'asc' }
      });
    }

    // Atualizar uma a uma para garantir a descrição correta
    for (const p of futuras) {
      const isCurrent = p.id === despesaAtual.id;
      // Calcula a diferença de meses em relação à parcela atual que foi editada
      // para manter as datas corretas nas faturas seguintes
      const mesesDiff = (p.parcelaAtual || 1) - (despesaAtual.parcelaAtual || 1);
      
      const novaDataVencimento = new Date(vencimento);
      novaDataVencimento.setMonth(novaDataVencimento.getMonth() + mesesDiff);

      await prisma.despesa.update({
        where: { id: p.id },
        data: {
          descricao: `${descricao} (${p.parcelaAtual}/${p.totalParcelas})`,
          valor,
          pagoPorId,
          categoria,
          vencimento: novaDataVencimento
        }
      });
    }
  } else {
    // Atualiza apenas a atual (se é parcela única ou se escolheu editar só a atual)
    let novaDescricao = descricao;
    if (despesaAtual.totalParcelas && despesaAtual.totalParcelas > 1) {
      novaDescricao = `${descricao} (${despesaAtual.parcelaAtual}/${despesaAtual.totalParcelas})`;
    }

    await prisma.despesa.updateMany({
      where: { id, ownerId },
      data: {
        descricao: novaDescricao,
        valor,
        pagoPorId,
        categoria,
        vencimento
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/lancamentos");
}
