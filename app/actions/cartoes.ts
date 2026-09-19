"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCartoes() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  return await prisma.cartao.findMany({
    where: { clerkUserId: userId },
    orderBy: { nome: 'asc' },
    include: {
      faturas: true
    }
  });
}

export async function addCartao(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const nome = formData.get("nome") as string;
  const limite = parseFloat(formData.get("limite") as string || "0");
  const diaVencimento = parseInt(formData.get("diaVencimento") as string);
  const diaFechamento = parseInt(formData.get("diaFechamento") as string);

  await prisma.cartao.create({
    data: {
      clerkUserId: userId,
      nome,
      limite: limite > 0 ? limite : null,
      diaVencimento,
      diaFechamento,
    },
  });

  revalidatePath("/cartoes");
}

export async function getFaturasPorMes() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  return await prisma.fatura.findMany({
    where: { clerkUserId: userId },
    include: {
      cartao: true,
      despesas: true
    },
    orderBy: [
      { ano: 'desc' },
      { mes: 'desc' }
    ]
  });
}

export async function updateFaturaStatus(id: string, status: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.fatura.updateMany({
    where: { id, clerkUserId: userId },
    data: { status }
  });
  revalidatePath("/cartoes");
}

export async function addDespesaParcelada(formData: FormData, cartaoId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valorTotal = parseFloat(formData.get("valorTotal") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  const categoria = formData.get("categoria") as string || "Outros";
  
  const dataCompraStr = formData.get("data") as string;
  const dataCompra = dataCompraStr ? new Date(dataCompraStr) : new Date();
  const parcelas = parseInt(formData.get("parcelas") as string || "1");

  const valorParcela = valorTotal / parcelas;
  const cartao = await prisma.cartao.findFirst({ where: { id: cartaoId, clerkUserId: userId } });
  
  if (!cartao) throw new Error("Cartão não encontrado");

  // Logic to generate parcels and associate them with respective invoices
  let mesAtual = dataCompra.getMonth() + 1; // 1-12
  let anoAtual = dataCompra.getFullYear();
  
  // Se a data da compra for maior ou igual ao dia de fechamento, a primeira fatura é no mês seguinte
  if (dataCompra.getDate() >= cartao.diaFechamento) {
    mesAtual++;
    if (mesAtual > 12) {
      mesAtual = 1;
      anoAtual++;
    }
  }

  for (let i = 1; i <= parcelas; i++) {
    // Check if Fatura exists for this month/year and card
    let fatura = await prisma.fatura.findFirst({
      where: { cartaoId: cartao.id, mes: mesAtual, ano: anoAtual, clerkUserId: userId }
    });

    if (!fatura) {
      fatura = await prisma.fatura.create({
        data: {
          clerkUserId: userId,
          cartaoId: cartao.id,
          mes: mesAtual,
          ano: anoAtual,
          status: "Aberta"
        }
      });
    }

    // Calcular data de vencimento da despesa (usando diaVencimento do cartão)
    // Para simplificar, colocamos no próprio mês de vencimento
    const dataVencimento = new Date(anoAtual, mesAtual - 1, cartao.diaVencimento);

    await prisma.despesa.create({
      data: {
        clerkUserId: userId,
        descricao: parcelas > 1 ? `${descricao} (${i}/${parcelas})` : descricao,
        valor: valorParcela,
        data: dataCompra,
        vencimento: dataVencimento,
        categoria,
        pagoPorId,
        statusPago: false,
        cartaoId: cartao.id,
        faturaId: fatura.id,
        parcelaAtual: parcelas > 1 ? i : null,
        totalParcelas: parcelas > 1 ? parcelas : null
      }
    });

    mesAtual++;
    if (mesAtual > 12) {
      mesAtual = 1;
      anoAtual++;
    }
  }

  revalidatePath("/cartoes");
  revalidatePath("/lancamentos");
}

export async function updateCartao(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const nome = formData.get("nome") as string;
  const limite = parseFloat(formData.get("limite") as string || "0");
  const diaVencimento = parseInt(formData.get("diaVencimento") as string);
  const diaFechamento = parseInt(formData.get("diaFechamento") as string);

  await prisma.cartao.updateMany({
    where: { id, clerkUserId: userId },
    data: {
      nome,
      limite: limite > 0 ? limite : null,
      diaVencimento,
      diaFechamento,
    },
  });

  revalidatePath("/cartoes");
}

export async function updateDespesa(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);

  await prisma.despesa.updateMany({
    where: { id, clerkUserId: userId },
    data: {
      descricao,
      valor
    },
  });

  revalidatePath("/cartoes");
}

export async function deleteDespesa(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.despesa.deleteMany({
    where: { id, clerkUserId: userId },
  });

  revalidatePath("/cartoes");
}
