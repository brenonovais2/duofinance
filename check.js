const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.despesa.count();
  console.log('Total despesas:', count);
  const comFatura = await prisma.despesa.findMany({
    where: { faturaCartao: { not: null } },
    take: 5
  });
  console.log('Exemplos:', comFatura);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
