"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addUsuario(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const nome = formData.get("nome") as string;
  
  if (!nome || nome.trim() === "") {
    throw new Error("Nome é obrigatório");
  }

  await prisma.usuario.create({
    data: {
      clerkUserId: userId,
      nome: nome.trim(),
    }
  });

  revalidatePath("/dashboard");
}

export async function deleteUsuario(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.usuario.deleteMany({
    where: { id, clerkUserId: userId }
  });
  
  revalidatePath("/dashboard");
}
