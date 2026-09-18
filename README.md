# DuoFinance 💑💸

DuoFinance é uma aplicação web voltada para a gestão financeira de casais ou pessoas que dividem despesas. O objetivo principal do projeto é facilitar o controle de gastos compartilhados, permitindo o registro de despesas, gestão de cartões de crédito, controle de faturas e o acerto de contas de forma simples e intuitiva.

## 🚀 Funcionalidades

- **Gestão de Despesas:** Registro de despesas com descrição, valor, data, categoria e identificação de quem pagou.
- **Controle de Cartões de Crédito:** Cadastro de cartões de crédito com limite, dia de vencimento e dia de fechamento.
- **Gestão de Faturas:** Acompanhamento de faturas (Aberta, Fechada, Paga) organizadas por mês e ano.
- **Despesas Parceladas:** Suporte para lançamento de despesas divididas em múltiplas parcelas vinculadas a uma fatura de cartão.
- **Acerto de Contas:** Visualização clara de quem pagou o quê, facilitando o cálculo de quem deve a quem no final do mês.
- **Dashboard Financeiro:** Interface moderna para visualização e resumos de gastos.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/) (React)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) (Ícones)
- **Backend/Banco de Dados:** [Prisma ORM](https://www.prisma.io/) com banco de dados **SQLite** local.
- **Linguagem:** TypeScript

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/) (Versão 20 ou superior)
- [Git](https://git-scm.com/)

## 📥 Instalação e Execução

Siga o passo a passo abaixo para rodar o projeto localmente:

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/duofinance.git
cd duofinance
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto (caso não exista) e adicione a URL de conexão com o banco de dados (SQLite):
```env
DATABASE_URL="file:./dev.db"
```

### 4. Inicialize o Banco de Dados
Execute as migrações do Prisma para criar as tabelas no SQLite:
```bash
npx prisma migrate dev --name init
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 6. Acesse a aplicação
Abra o seu navegador e acesse [http://localhost:3000](http://localhost:3000).

---

## 🤝 Contribuindo

Pull requests são sempre bem-vindos! Para mudanças maiores, por favor, abra uma issue primeiro para discutir o que você gostaria de mudar.

## 📝 Licença

Este projeto está sob a licença MIT.