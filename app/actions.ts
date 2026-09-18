"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addDespesa(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  
  const categoria = formData.get("categoria") as string || "Outros";
  const vencimentoStr = formData.get("vencimento") as string;
  const vencimento = vencimentoStr ? new Date(vencimentoStr) : new Date();
  const statusPago = formData.get("statusPago") === "on";

  await prisma.despesa.create({
    data: {
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
  await prisma.despesa.update({
    where: { id },
    data: { statusPago }
  });
  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function deleteDespesa(id: string) {
  await prisma.despesa.delete({
    where: { id }
  });
  revalidatePath("/");
  revalidatePath("/lancamentos");
}
