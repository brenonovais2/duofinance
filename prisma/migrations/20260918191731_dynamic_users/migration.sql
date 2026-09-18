/*
  Warnings:

  - You are about to drop the column `rateio` on the `Despesa` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Cartao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "limite" REAL,
    "diaVencimento" INTEGER NOT NULL,
    "diaFechamento" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Fatura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartaoId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aberta',
    CONSTRAINT "Fatura_cartaoId_fkey" FOREIGN KEY ("cartaoId") REFERENCES "Cartao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Despesa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoria" TEXT NOT NULL DEFAULT 'Outros',
    "vencimento" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusPago" BOOLEAN NOT NULL DEFAULT false,
    "faturaCartao" TEXT,
    "pagoPorId" TEXT NOT NULL,
    "cartaoId" TEXT,
    "faturaId" TEXT,
    "parcelaAtual" INTEGER,
    "totalParcelas" INTEGER,
    CONSTRAINT "Despesa_pagoPorId_fkey" FOREIGN KEY ("pagoPorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Despesa_cartaoId_fkey" FOREIGN KEY ("cartaoId") REFERENCES "Cartao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Despesa_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "Fatura" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Despesa" ("categoria", "data", "descricao", "faturaCartao", "id", "pagoPorId", "statusPago", "valor", "vencimento") SELECT "categoria", "data", "descricao", "faturaCartao", "id", "pagoPorId", "statusPago", "valor", "vencimento" FROM "Despesa";
DROP TABLE "Despesa";
ALTER TABLE "new_Despesa" RENAME TO "Despesa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
