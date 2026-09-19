"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addDespesa(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  
  const categoria = formData.get("categoria") as string || "Outros";
  const vencimentoStr = formData.get("vencimento") as string;
  const vencimento = vencimentoStr ? new Date(vencimentoStr) : new Date();
  const statusPago = formData.get("statusPago") === "on";

  await prisma.despesa.create({
    data: {
      clerkUserId: userId,
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
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.despesa.updateMany({
    where: { id, clerkUserId: userId },
    data: { statusPago }
  });
  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function deleteDespesa(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.despesa.deleteMany({
    where: { id, clerkUserId: userId }
  });
  revalidatePath("/");
  revalidatePath("/lancamentos");
}
