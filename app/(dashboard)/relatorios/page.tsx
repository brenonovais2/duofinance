import React from "react";
import RelatoriosClient from "./RelatoriosClient";
import { getBalancoMensal } from "@/app/actions/relatorios";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const data = await getBalancoMensal();

  return <RelatoriosClient data={data} />;
}
