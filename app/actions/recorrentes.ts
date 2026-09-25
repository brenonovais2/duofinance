"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addDespesaRecorrente(formData: FormData) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  const categoria = formData.get("categoria") as string || "Outros";
  const diaVencimento = parseInt(formData.get("diaVencimento") as string);
  
  const tipoRateio = formData.get("tipoRateio") as string || "50_50";
  const beneficiadoId = formData.get("beneficiadoId") as string || null;
  const rateioPagadorStr = formData.get("rateioPagador") as string;
  const rateioPagador = rateioPagadorStr ? parseFloat(rateioPagadorStr) : null;
  const cartaoId = formData.get("cartaoId") as string || null;

  await prisma.despesaRecorrente.create({
    data: {
      ownerId,
      descricao,
      valor,
      categoria,
      diaVencimento,
      pagoPorId,
      tipoRateio,
      beneficiadoId,
      rateioPagador,
      cartaoId,
      status: "Ativa",
      ultimaGeracao: null // Nunca gerado ainda
    }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function updateDespesaRecorrenteStatus(id: string, status: string) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  await prisma.despesaRecorrente.updateMany({
    where: { id, ownerId },
    data: { status }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function editDespesaRecorrente(id: string, formData: FormData) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  const descricao = formData.get("descricao") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const pagoPorId = formData.get("pagoPorId") as string;
  const categoria = formData.get("categoria") as string || "Outros";
  const diaVencimento = parseInt(formData.get("diaVencimento") as string);
  
  const tipoRateio = formData.get("tipoRateio") as string || "50_50";
  const beneficiadoId = formData.get("beneficiadoId") as string || null;
  const rateioPagadorStr = formData.get("rateioPagador") as string;
  const rateioPagador = rateioPagadorStr ? parseFloat(rateioPagadorStr) : null;
  const cartaoId = formData.get("cartaoId") as string || null;

  await prisma.despesaRecorrente.updateMany({
    where: { id, ownerId },
    data: {
      descricao,
      valor,
      categoria,
      diaVencimento,
      pagoPorId,
      tipoRateio,
      beneficiadoId,
      rateioPagador,
      cartaoId
    }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function deleteDespesaRecorrente(id: string) {
  const { userId, orgId } = await auth();
  const ownerId = orgId || userId;
  if (!ownerId) throw new Error("Não autorizado");

  await prisma.despesaRecorrente.deleteMany({
    where: { id, ownerId }
  });

  revalidatePath("/");
  revalidatePath("/lancamentos");
}

export async function verificarEGerarDespesasRecorrentes(ownerId: string) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const recorrentes = await prisma.despesaRecorrente.findMany({
    where: { 
      ownerId,
      status: "Ativa" 
    }
  });

  for (const rec of recorrentes) {
    let precisaGerar = false;
    let mesesAGerar = 0;

    if (!rec.ultimaGeracao) {
      precisaGerar = true;
      mesesAGerar = 1;
    } else {
      const ultima = new Date(rec.ultimaGeracao);
      const difMeses = (anoAtual - ultima.getFullYear()) * 12 + (mesAtual - ultima.getMonth());
      if (difMeses > 0) {
        precisaGerar = true;
        mesesAGerar = difMeses;
      }
    }

    if (precisaGerar) {
      for (let i = 0; i < mesesAGerar; i++) {
        const mesesAtras = mesesAGerar - 1 - i;
        const dataReferencia = new Date(anoAtual, mesAtual - mesesAtras, 1);
        
        const refMes = dataReferencia.getMonth();
        const refAno = dataReferencia.getFullYear();
        
        let dia = rec.diaVencimento;
        const ultimoDiaDoMes = new Date(refAno, refMes + 1, 0).getDate();
        if (dia > ultimoDiaDoMes) dia = ultimoDiaDoMes;
        
        const dataCompra = new Date(refAno, refMes, dia);

        if (rec.cartaoId) {
          const cartao = await prisma.cartao.findFirst({ where: { id: rec.cartaoId } });
          if (cartao) {
            let faturaMes = dataCompra.getMonth() + 1; // 1-12
            let faturaAno = dataCompra.getFullYear();
            
            if (dataCompra.getDate() >= cartao.diaFechamento) {
              faturaMes++;
              if (faturaMes > 12) {
                faturaMes = 1;
                faturaAno++;
              }
            }

            let fatura = await prisma.fatura.findFirst({
              where: { cartaoId: cartao.id, mes: faturaMes, ano: faturaAno, ownerId: rec.ownerId }
            });

            if (!fatura) {
              fatura = await prisma.fatura.create({
                data: {
                  ownerId: rec.ownerId,
                  cartaoId: cartao.id,
                  mes: faturaMes,
                  ano: faturaAno,
                  status: "Aberta"
                }
              });
            }

            const dataVencimentoFatura = new Date(faturaAno, faturaMes - 1, cartao.diaVencimento);

            await prisma.despesa.create({
              data: {
                ownerId: rec.ownerId,
                descricao: rec.descricao,
                valor: rec.valor,
                data: dataCompra,
                vencimento: dataVencimentoFatura,
                categoria: rec.categoria,
                pagoPorId: rec.pagoPorId,
                statusPago: false,
                cartaoId: cartao.id,
                faturaId: fatura.id,
                tipoRateio: rec.tipoRateio,
                beneficiadoId: rec.beneficiadoId,
                rateioPagador: rec.rateioPagador
              }
            });
          }
        } else {
          await prisma.despesa.create({
            data: {
              ownerId: rec.ownerId,
              descricao: rec.descricao,
              valor: rec.valor,
              categoria: rec.categoria,
              data: dataCompra,
              vencimento: dataCompra,
              statusPago: false,
              pagoPorId: rec.pagoPorId,
              tipoRateio: rec.tipoRateio,
              beneficiadoId: rec.beneficiadoId,
              rateioPagador: rec.rateioPagador
            }
          });
        }
      }

      await prisma.despesaRecorrente.update({
        where: { id: rec.id },
        data: { ultimaGeracao: new Date(anoAtual, mesAtual, 1) } 
      });
    }
  }
}
