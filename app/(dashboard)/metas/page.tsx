import { getMetas } from "@/app/actions/metas";
import MetasClient from "./MetasClient";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function MetasPage() {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  
  const metas = await getMetas();
  const usuarios = ownerId ? await prisma.usuario.findMany({ where: { ownerId } }) : [];

  return <MetasClient initialMetas={metas} usuarios={usuarios} />;
}
