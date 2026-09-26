export function getCartaoDates(diaFechamento: number, diaVencimento: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcula próximo fechamento
  let proximoFechamento = new Date(today.getFullYear(), today.getMonth(), diaFechamento);
  if (today.getDate() >= diaFechamento) {
    proximoFechamento.setMonth(proximoFechamento.getMonth() + 1);
  }

  // Calcula próximo vencimento
  let proximoVencimento = new Date(today.getFullYear(), today.getMonth(), diaVencimento);
  // Se o vencimento for antes do fechamento (ex: fecha dia 25, vence dia 5)
  // Então o vencimento da fatura atual é no próximo mês
  if (diaVencimento < diaFechamento) {
      if (today.getDate() >= diaFechamento) {
          proximoVencimento = new Date(today.getFullYear(), today.getMonth() + 2, diaVencimento);
      } else {
          proximoVencimento = new Date(today.getFullYear(), today.getMonth() + 1, diaVencimento);
      }
  } else {
      if (today.getDate() > diaVencimento) {
          proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
      }
  }


  const diffTimeFechamento = proximoFechamento.getTime() - today.getTime();
  const diasParaFechamento = Math.ceil(diffTimeFechamento / (1000 * 60 * 60 * 24));

  const diffTimeVencimento = proximoVencimento.getTime() - today.getTime();
  const diasParaVencimento = Math.ceil(diffTimeVencimento / (1000 * 60 * 60 * 24));

  const fechandoEmBreve = diasParaFechamento <= 3 && diasParaFechamento >= 0;

  return {
    proximoFechamento,
    proximoVencimento,
    diasParaFechamento,
    diasParaVencimento,
    fechandoEmBreve,
    melhorDiaCompra: diaFechamento
  };
}
