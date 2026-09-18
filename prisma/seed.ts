import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Minimal seed, no hardcoded users required. Users can be added dynamically.
  console.log("Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
