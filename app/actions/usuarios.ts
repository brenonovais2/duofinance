"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addUsuario(formData: FormData) {
  const nome = formData.get("nome") as string;
  
  if (!nome || nome.trim() === "") {
    throw new Error("Nome é obrigatório");
  }

  await prisma.usuario.create({
    data: {
      nome: nome.trim(),
    }
  });

  revalidatePath("/dashboard");
}

export async function deleteUsuario(id: string) {
  await prisma.usuario.delete({
    where: { id }
  });
  
  revalidatePath("/dashboard");
}
