import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { verificarEGerarDespesasRecorrentes } from "@/app/actions/recorrentes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  
  let usuarios: {id: string, nome: string}[] = [];
  if (ownerId) {
    usuarios = await prisma.usuario.findMany({
      where: { ownerId },
      orderBy: { nome: 'asc' }
    });
    
    // Dispara a verificação de despesas recorrentes
    await verificarEGerarDespesasRecorrentes(ownerId);
  }

  return (
    <div className="min-h-screen bg-[#F2F5F7] text-[#0B032D] font-sans flex flex-col md:flex-row">
      <Sidebar usuarios={usuarios} />
      {children}
    </div>
  );
}
