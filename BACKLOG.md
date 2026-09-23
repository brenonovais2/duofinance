# 📋 DuoFinance — Backlog de Funcionalidades e Evolução do Produto

Este documento reúne o backlog estratégico e técnico de novas funcionalidades para o **DuoFinance**, projetado para consolidar a plataforma como a principal solução de gestão financeira compartilhada para casais e parceiros.

---

## 🎯 Visão Geral e Diagnóstico Atual

| Área | Situação Atual | Oportunidade de Evolução |
| :--- | :--- | :--- |
| **Divisão de Despesas** | Apenas registra quem pagou cada despesa. | Implementar divisões flexíveis (50/50, proporcional à renda, pessoal) e cálculo do saldo devedor/credor ("quem deve a quem"). |
| **Lançamentos** | Cadastro básico, exclusão e alteração de status. O botão "Editar" está desativado. | Finalizar edição completa, suporte a despesas fixas recorrentes e categorização flexível. |
| **Cartões e Faturas** | Faturas com parcelamento manual e status. | Visualização de melhor dia de compra, limite em tempo real e conciliação de faturas. |
| **Relatórios** | Exibição fixa do mês atual com barras simples. | Navegação temporal (seletor de meses/anos), gráficos interativos (Recharts) e exportação em PDF/Excel. |
| **Automação & IA** | Entradas 100% manuais. | Reconhecimento de comprovantes/notas fiscais via OCR/IA (Gemini) e importação OFX/CSV. |
| **Engajamento & Metas** | Foco exclusivamente transacional (despesas passadas). | Criação de "Cofrinhos/Metas do Casal" e tetos de gastos mensais por categoria. |

---

## 🚦 Matriz de Priorização (MoSCoW)

- **Must Have (Essencial / Curto Prazo):** Finalização da edição de lançamentos, Acerto de Contas com balanço líquido, Seletor de mês/ano nos relatórios e Despesas Recorrentes.
- **Should Have (Importante / Médio Prazo):** Cofrinhos/Metas do casal, Orçamento por categoria com alertas, Divisão proporcional por renda e Exportação PDF/Excel.
- **Could Have (Desejável / Médio-Longo Prazo):** Importação de arquivos bancários (OFX/CSV), Leitura de comprovantes com IA (Gemini OCR), PWA e Gráficos avançados.
- **Won't Have Now (Futuro):** Integração bancária direta via Open Finance (Pluggy/Belvo), múltiplos núcleos familiares.

---

## 📦 Épicos e Histórias de Usuário

### Épico 1: Acerto de Contas & Divisão Inteligente (Core Business)
> **Objetivo:** Responder com exatidão à pergunta central dos usuários: *"Quem pagou o quê e quem deve quanto no final do mês?"*

#### 1.1 Cálculo Automático de Saldo Líquido ("Quem deve a quem")
- **Prioridade:** 🔴 Alta (Must Have) | **Estimativa:** M
- **Descrição:** Criar na página de Relatórios e no Dashboard um card em destaque com o resultado líquido do mês (ex: *"Breno pagou R$ 3.000,00 e Maria pagou R$ 1.800,00. O gasto total foi R$ 4.800,00 (R$ 2.400,00 para cada). Maria deve transferir R$ 600,00 para Breno"*).
- **Critérios de Aceite:**
  - Exibir o valor exato a ser transferido entre os pagantes.
  - Botão de "Copiar chave PIX" do credor (cadastrável no perfil do pagante).
  - Botão "Marcar Mês como Quitado", salvando o registro histórico do acerto.

#### 1.2 Regras de Divisão Flexíveis por Despesa
- **Prioridade:** 🔴 Alta (Must Have) | **Estimativa:** G
- **Descrição:** Ao cadastrar uma despesa, permitir escolher como ela deve ser rateada:
  1. **50% / 50%:** Divisão padrão entre o casal.
  2. **100% Individual:** Gasto exclusivo de um usuário (não entra no rateio da casa, mas permite centralizar o controle de cartão).
  3. **Personalizada (% ou R$):** Ex: 70% para um e 30% para outro.
- **Critérios de Aceite:**
  - Atualização do schema Prisma (`Despesa`) para suportar regra de divisão.
  - Atualização dos cálculos de dashboard e relatórios respeitando o rateio.

#### 1.3 Divisão Proporcional à Renda Mensal
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** P
- **Descrição:** Permitir que o casal cadastre opcionalmente sua renda líquida mensal (ex: Usuário A ganha R$ 6.000 e Usuário B ganha R$ 4.000). As despesas com flag "Proporcional à Renda" passam a ser divididas automaticamente em 60/40.
- **Critérios de Aceite:**
  - Campo de salário/renda na gestão de usuários.
  - Opção no modal de despesas: "Dividir proporcionalmente à renda".

---

### Épico 2: Gestão Financeira Completa & Melhorias de Usabilidade
> **Objetivo:** Eliminar pendências de usabilidade da versão atual e automatizar lançamentos repetitivos.

#### 2.1 Edição Completa de Lançamentos em `/lancamentos`
- **Prioridade:** 🔴 Alta (Must Have) | **Estimativa:** P
- **Descrição:** Implementar o modal de edição na tabela de lançamentos (atualmente com tooltip *"Editar (Em breve)"*).
- **Critérios de Aceite:**
  - Permitir alterar descrição, valor, data de vencimento, categoria e pagador.
  - Tratar adequadamente despesas parceladas (editar apenas a parcela atual ou replicar para as parcelas futuras).

#### 2.2 Despesas Recorrentes e Fixas (Assinaturas e Contas da Casa)
- **Prioridade:** 🔴 Alta (Must Have) | **Estimativa:** M
- **Descrição:** Criar cadastro de despesas fixas (Aluguel, Condomínio, Energia, Internet, Netflix, Academia) que geram automaticamente as despesas no primeiro dia de cada mês ou em data definida.
- **Critérios de Aceite:**
  - Tabela `DespesaRecorrente` no Prisma.
  - Job/verificação automática ao abrir o app no novo mês para lançar as contas pendentes.
  - Opção de pausar ou arquivar uma recorrência.

#### 2.3 Categorias Customizáveis com Cores e Ícones
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** M
- **Descrição:** Substituir o conjunto fixo de categorias (`Mercado`, `Casa`, `Veículo`, `Outros`) por um CRUD de categorias dinâmicas por conta/organização, permitindo definir nome, cor e ícone da biblioteca Lucide.
- **Critérios de Aceite:**
  - Model `Categoria` no Prisma com vínculo a `ownerId`.
  - Migração de dados das despesas existentes.
  - Seleção visual moderna no modal de criação/edição de despesa.

#### 2.4 Navegação Temporal e Filtro de Período em Relatórios
- **Prioridade:** 🔴 Alta (Must Have) | **Estimativa:** P
- **Descrição:** A action `getBalancoMensal(mes, ano)` já possui suporte a parâmetros, mas a interface de `/relatorios` e `/dashboard` está fixa no mês corrente. Adicionar controles de retroceder/avançar mês e seletor dropdown de mês/ano.
- **Critérios de Aceite:**
  - Seletor de mês/ano no topo das páginas de Relatórios e Dashboard.
  - Sincronização via Query Params (`?mes=8&ano=2026`).

---

### Épico 3: Cartões de Crédito e Faturas Inteligentes
> **Objetivo:** Tornar o controle de cartões de crédito preventivo, transparente e à prova de surpresas.

#### 3.1 Destaque do "Melhor Dia de Compra" e Dias para Fechamento
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** P
- **Descrição:** Exibir em cada card de cartão um badge indicando o melhor dia de compra (geralmente o dia do fechamento) e uma contagem regressiva para o vencimento/fechamento da fatura atual.
- **Critérios de Aceite:**
  - Cálculo dinâmico baseado na data atual e nos campos `diaFechamento` e `diaVencimento`.
  - Alerta visual caso a fatura esteja fechando nos próximos 3 dias.

#### 3.2 Visualização e Barra de Consumo de Limite
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** P
- **Descrição:** Para cartões com limite configurado, exibir barra de progresso com: Limite Total, Comprometido no Mês, Comprometido em Parcelas Futuras e Limite Disponível.
- **Critérios de Aceite:**
  - Soma de todas as parcelas não pagas vinculadas ao cartão.
  - Mudança de cor da barra (verde até 70%, amarelo até 90%, vermelho acima de 90%).

#### 3.3 Antecipação e Amortização de Parcelas
- **Prioridade:** 🟢 Baixa (Could Have) | **Estimativa:** M
- **Descrição:** Permitir antecipar parcelas futuras de uma compra para a fatura aberta atual (comum ao receber 13º salário ou bônus).
- **Critérios de Aceite:**
  - Ação para puxar parcelas restantes de faturas futuras para a fatura aberta do mês selecionado.

---

### Épico 4: Automação Inteligente & IA (Smart Duo)
> **Objetivo:** Reduzir o atrito de cadastrar gastos manuais após compras diárias.

#### 4.1 Leitura de Comprovante PIX e Nota Fiscal via Gemini AI (OCR Inteligente)
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** M
- **Descrição:** Botão no modal "Anexar Comprovante / Foto". A imagem é enviada para a API multimodal do Google Gemini, que extrai automaticamente:
  - Valor total
  - Data da transação
  - Nome do estabelecimento / favorecido
  - Sugestão inteligente de categoria
- **Critérios de Aceite:**
  - Interface de upload simples (arrastar ou tirar foto pelo celular).
  - Pré-preenchimento dos campos do formulário para confirmação humana antes de salvar.

#### 4.2 Importação de Fatura e Extrato Bancário (OFX / CSV)
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** G
- **Descrição:** Importador de arquivos `.ofx` ou `.csv` exportados de bancos (Nubank, Inter, Itaú, C6, etc.), permitindo selecionar em lote quais lançamentos devem entrar na fatura ou no extrato da casa.
- **Critérios de Aceite:**
  - Parser de OFX/CSV no backend.
  - Tela de conciliação e conferência antes de efetivar os lançamentos.
  - Prevenção de duplicidade por hash/data/valor.

#### 4.3 Assistente de Gastos e Insights Mensais
- **Prioridade:** 🟢 Baixa (Could Have) | **Estimativa:** M
- **Descrição:** Geração de diagnósticos em linguagem natural no fechamento do mês (ex: *"Vocês gastaram 28% a mais em Mercado este mês em relação à média dos últimos 3 meses"*).

---

### Épico 5: Planejamento, Metas & Orçamentos (Cofrinhos do Casal)
> **Objetivo:** Ir além do histórico de dívidas e ajudar o casal a construir patrimônio compartilhado.

#### 5.1 Cofrinhos & Sonhos Compartilhados
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** M
- **Descrição:** Módulo de metas financeiras do casal (ex: *"Viagem para a praia"*, *"Entrada do Carro"*, *"Reserva de Emergência"*).
- **Critérios de Aceite:**
  - Cadastro de meta com valor alvo, data alvo e foto de capa.
  - Registro de aportes e retiradas com identificação de quem aportou.
  - Barra de progresso percentual e estimativa de tempo restante.

#### 5.2 Orçamento Mensal por Categoria (Budgeting com Alertas)
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** M
- **Descrição:** Definir teto de gastos mensal por categoria (ex: R$ 1.200 em Mercado, R$ 400 em Lazer/Restaurantes).
- **Critérios de Aceite:**
  - Exibição de termômetro visual no dashboard indicando se a categoria está dentro do teto ou estourou o limite.

---

### Épico 6: Relatórios Visuais & Exportação
> **Objetivo:** Permitir análise analítica e compartilhamento formal do fechamento do mês.

#### 6.1 Gráficos Interativos (Recharts / Chart.js)
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** M
- **Descrição:** Substituir as barras estáticas por gráficos modernos:
  - Gráfico de Rosca/Donut interativo de categorias com tooltip de valores.
  - Gráfico de barras comparando mês a mês a evolução das despesas.
  - Gráfico de proporção de gastos por pagante ao longo do ano.
- **Critérios de Aceite:**
  - Instalação e integração do `recharts` otimizado para React 19 / Next.js.
  - Design consistente com a paleta do DuoFinance (`#5E2BFF`, `#0B032D`, `#FDB833`).

#### 6.2 Exportação de Relatório Mensal em PDF e Excel
- **Prioridade:** 🟢 Baixa (Could Have) | **Estimativa:** P
- **Descrição:** Botão no cabeçalho de Relatórios para gerar um arquivo PDF limpo e formatado do fechamento do mês ou planilha `.xlsx` com a listagem detalhada de todos os lançamentos.
- **Critérios de Aceite:**
  - Geração de PDF no lado do cliente ou servidor (ex: `@react-pdf/renderer` ou `jspdf`).
  - Exportação de tabela CSV/Excel estruturada.

---

### Épico 7: Experiência do Usuário (UX/UI), Mobile & Segurança
> **Objetivo:** Tornar o uso diário ágil e agradável nos smartphones.

#### 7.1 Progressive Web App (PWA) e Otimização Mobile
- **Prioridade:** 🟡 Média (Should Have) | **Estimativa:** P
- **Descrição:** Configurar manifesto PWA, service worker básico e meta-tags para permitir a instalação do DuoFinance direto na tela inicial do iOS e Android como um app.
- **Critérios de Aceite:**
  - `manifest.json`, ícones PWA e barra de status mobile padronizada.
  - Bottom navigation bar para dispositivos móveis substituindo a sidebar em telas estreitas.

#### 7.2 Modo Privacidade ("Modo Olhinho")
- **Prioridade:** 🟢 Baixa (Could Have) | **Estimativa:** P
- **Descrição:** Botão rápido no header para mascarar todos os valores monetários (`R$ •••••`), útil para usar o app em locais públicos, transporte ou trabalho.
- **Critérios de Aceite:**
  - Estado global ou persistido no `localStorage`.

#### 7.3 Dark Mode Nativo
- **Prioridade:** 🟢 Baixa (Could Have) | **Estimativa:** M
- **Descrição:** Suporte a tema escuro automático (baseado no sistema) ou manual via toggle, com classes Tailwind.

---

## 🗺️ Roadmap Sugerido de Implementação

```mermaid
flowchart TD
    subgraph Sprint 1: Correções e Acerto de Contas Core
        S1A["1.1 Cálculo do Acerto de Contas ('Quem deve a quem')"]
        S1B["2.1 Edição de Despesas em Lançamentos"]
        S1C["2.4 Seletor de Mês/Ano nos Relatórios & Dashboard"]
    end

    subgraph Sprint 2: Automação & Divisão Flexível
        S2A["1.2 Divisão Flexível (50/50, 100% Individual, Personalizada)"]
        S2B["2.2 Despesas Recorrentes Automáticas"]
        S2C["3.1 Melhor Dia de Compra & Vencimentos em Cartões"]
    end

    subgraph Sprint 3: Visualização & Engajamento
        S3A["6.1 Gráficos Interativos (Recharts)"]
        S3B["5.1 Cofrinhos & Metas Compartilhadas"]
        S3C["7.1 PWA & Bottom Nav Mobile"]
    end

    subgraph Sprint 4: Inteligência & Integrações
        S4A["4.1 Leitura de Comprovantes com Gemini Vision OCR"]
        S4B["4.2 Importação de Extratos OFX/CSV"]
        S4C["6.2 Exportação de Relatórios em PDF/Excel"]
    end

    Sprint 1 --> Sprint 2 --> Sprint 3 --> Sprint 4
```

---

## 🛠️ Sugestões de Modelagem de Dados (Prisma Schema)

Para suportar os novos recursos, o modelo de banco de dados pode ser expandido de forma incremental:

```prisma
// Exemplo de extensão para o prisma/schema.prisma

model Usuario {
  id          String    @id @default(uuid())
  ownerId     String?
  nome        String
  pixKey      String?   // Chave PIX para liquidação rápida
  renda       Float?    // Renda mensal para divisão proporcional
  despesas    Despesa[] @relation("DespesasPagas")
  aportes     AporteMeta[]
}

model Categoria {
  id        String    @id @default(uuid())
  ownerId   String
  nome      String
  cor       String    @default("#5E2BFF")
  icone     String    @default("Tag")
  tetoGasto Float?    // Orçamento mensal máximo
}

model DespesaRecorrente {
  id          String    @id @default(uuid())
  ownerId     String
  descricao   String
  valor       Float
  diaMes      Int       // Dia de vencimento todo mês (1 a 31)
  categoria   String
  pagoPorId   String
  tipoDivisao String    @default("50_50") // 50_50, PROPORCIONAL, INDIVIDUAL
  ativa       Boolean   @default(true)
}

model Meta {
  id          String       @id @default(uuid())
  ownerId     String
  titulo      String
  valorAlvo   Float
  dataAlvo    DateTime?
  cor         String       @default("#FDB833")
  aportes     AporteMeta[]
}

model AporteMeta {
  id        String   @id @default(uuid())
  metaId    String
  meta      Meta     @relation(fields: [metaId], references: [id], onDelete: Cascade)
  usuarioId String
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  valor     Float
  data      DateTime @default(now())
}
```
