/*
  Warnings:

  - You are about to drop the column `alturaEstampa` on the `Camiseta` table. All the data in the column will be lost.
  - You are about to drop the column `anchoEstampa` on the `Camiseta` table. All the data in the column will be lost.
  - You are about to drop the column `posicionEstampaX` on the `Camiseta` table. All the data in the column will be lost.
  - You are about to drop the column `posicionEstampaY` on the `Camiseta` table. All the data in the column will be lost.
  - Added the required column `estado` to the `Camiseta` table without a default value. This is not possible if the table is not empty.
  - Made the column `camisetaImagen` on table `Camiseta` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Camiseta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "talla" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "estampaId" INTEGER NOT NULL,
    "clienteId" INTEGER,
    "estado" TEXT NOT NULL,
    "camisetaImagen" TEXT NOT NULL,
    CONSTRAINT "Camiseta_estampaId_fkey" FOREIGN KEY ("estampaId") REFERENCES "Estampa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Camiseta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Camiseta" ("camisetaImagen", "clienteId", "color", "estampaId", "id", "material", "modelo", "precio", "talla") SELECT "camisetaImagen", "clienteId", "color", "estampaId", "id", "material", "modelo", "precio", "talla" FROM "Camiseta";
DROP TABLE "Camiseta";
ALTER TABLE "new_Camiseta" RENAME TO "Camiseta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
