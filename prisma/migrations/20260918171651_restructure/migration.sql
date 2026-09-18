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
    "rateio" REAL NOT NULL DEFAULT 0.5,
    "faturaCartao" TEXT,
    "pagoPorId" TEXT NOT NULL,
    CONSTRAINT "Despesa_pagoPorId_fkey" FOREIGN KEY ("pagoPorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Despesa" ("data", "descricao", "faturaCartao", "id", "pagoPorId", "rateio", "valor") SELECT "data", "descricao", "faturaCartao", "id", "pagoPorId", "rateio", "valor" FROM "Despesa";
DROP TABLE "Despesa";
ALTER TABLE "new_Despesa" RENAME TO "Despesa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
