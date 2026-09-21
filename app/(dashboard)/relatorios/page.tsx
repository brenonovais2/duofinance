import React from "react";
import RelatoriosClient from "./RelatoriosClient";
import { getBalancoMensal } from "@/app/actions/relatorios";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  let mes: number | undefined;
  let ano: number | undefined;

  if (searchParams?.mes && typeof searchParams.mes === 'string') {
    mes = parseInt(searchParams.mes);
  }
  if (searchParams?.ano && typeof searchParams.ano === 'string') {
    ano = parseInt(searchParams.ano);
  }

  const data = await getBalancoMensal(mes, ano);

  return <RelatoriosClient data={data} />;
}
