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
