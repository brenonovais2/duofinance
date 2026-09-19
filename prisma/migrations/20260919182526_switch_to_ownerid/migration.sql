-- AlterTable
ALTER TABLE "Cartao" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Despesa" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Fatura" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "ownerId" TEXT;
