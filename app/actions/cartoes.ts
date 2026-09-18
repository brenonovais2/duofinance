"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getCartoes() {
  return await prisma.cartao.findMany({
    orderBy: { nome: 'asc' },
    include: {
      faturas: true
    }
  });
}

export async function addCartao(formData: FormData) {
  const nome = formData.get("nome") as string;
  const limite = parseFloat(formData.get("limite") as string || "0");
  const diaVencimento = parseInt(formData.get("diaVencimento") as string);
  const diaFechamento = parseInt(formData.get("diaFechamento") as string);

  await prisma.cartao.create({
    data: {
      nome,
      limite: limite > 0 ? limite : null,
      diaVencimento,
      diaFechamento,
    },
  });

  revalidatePath("/cartoes");
}

export async function getFaturasPorMes() {
  return await prisma.fatura.findMany({
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
  await prisma.fatura.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/cartoes");
}

export async function addDespesaParcelada(formData: FormData, cartaoId: string) {
  const descricao = formData.get("descricao") as string;
  const valorTotal = parseFloat(formData.get("valorTotal") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  const categoria = formData.get("categoria") as string || "Outros";
  
  const dataCompraStr = formData.get("data") as string;
  const dataCompra = dataCompraStr ? new Date(dataCompraStr) : new Date();
  const parcelas = parseInt(formData.get("parcelas") as string || "1");

  const valorParcela = valorTotal / parcelas;
  const cartao = await prisma.cartao.findUnique({ where: { id: cartaoId } });
  
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
      where: { cartaoId: cartao.id, mes: mesAtual, ano: anoAtual }
    });

    if (!fatura) {
      fatura = await prisma.fatura.create({
        data: {
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
  const nome = formData.get("nome") as string;
  const limite = parseFloat(formData.get("limite") as string || "0");
  const diaVencimento = parseInt(formData.get("diaVencimento") as string);
  const diaFechamento = parseInt(formData.get("diaFechamento") as string);

  await prisma.cartao.update({
    where: { id },
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
  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);

  await prisma.despesa.update({
    where: { id },
    data: {
      descricao,
      valor
    },
  });

  revalidatePath("/cartoes");
}

export async function deleteDespesa(id: string) {
  await prisma.despesa.delete({
    where: { id },
  });

  revalidatePath("/cartoes");
}
