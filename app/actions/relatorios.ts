"use server";

import { prisma } from "@/lib/prisma";

export async function getBalancoMensal(mes?: number, ano?: number) {
  const currentDate = new Date();
  const targetMes = mes || currentDate.getMonth() + 1;
  const targetAno = ano || currentDate.getFullYear();

  // Buscar todas as despesas do mês selecionado
  const startDate = new Date(targetAno, targetMes - 1, 1);
  const endDate = new Date(targetAno, targetMes, 0, 23, 59, 59, 999);

  const despesas = await prisma.despesa.findMany({
    where: {
      data: {
        gte: startDate,
        lte: endDate,
      }
    },
    include: {
      pagoPor: true
    }
  });

  const usuarios = await prisma.usuario.findMany();
  
  let totalCasa = 0;
  const pagamentosPorUsuario: Record<string, { id: string, nome: string, totalPago: number }> = {};
  
  usuarios.forEach(u => {
    pagamentosPorUsuario[u.id] = { id: u.id, nome: u.nome, totalPago: 0 };
  });

  const gastosPorCategoria: Record<string, number> = {};

  despesas.forEach(d => {
    totalCasa += d.valor;
    if (pagamentosPorUsuario[d.pagoPorId]) {
      pagamentosPorUsuario[d.pagoPorId].totalPago += d.valor;
    }
    
    const categoria = d.categoria || "Outros";
    if (gastosPorCategoria[categoria]) {
      gastosPorCategoria[categoria] += d.valor;
    } else {
      gastosPorCategoria[categoria] = d.valor;
    }
  });

  const finalUserStats = Object.values(pagamentosPorUsuario).map(u => ({
    ...u
  }));

  const categoriasChart = Object.entries(gastosPorCategoria)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);

  return {
    mes: targetMes,
    ano: targetAno,
    totalCasa,
    usuarios: finalUserStats,
    categorias: categoriasChart
  };
}
