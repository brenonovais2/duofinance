"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addUsuario(formData: FormData) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const nome = formData.get("nome") as string;
  
  if (!nome || nome.trim() === "") {
    throw new Error("Nome é obrigatório");
  }

  await prisma.usuario.create({
    data: {
      ownerId,
      nome: nome.trim(),
    }
  });

  revalidatePath("/dashboard");
}

export async function deleteUsuario(id: string) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  await prisma.usuario.deleteMany({
    where: { id, ownerId }
  });
  
  revalidatePath("/dashboard");
}
