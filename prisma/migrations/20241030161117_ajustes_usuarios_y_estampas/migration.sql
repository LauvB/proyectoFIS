/*
  Warnings:

  - You are about to drop the column `autorId` on the `Estampa` table. All the data in the column will be lost.
  - You are about to drop the column `imagenes` on the `Estampa` table. All the data in the column will be lost.
  - You are about to drop the column `artistaId` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Artista` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Imagen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "estampaId" INTEGER NOT NULL,
    CONSTRAINT "Imagen_estampaId_fkey" FOREIGN KEY ("estampaId") REFERENCES "Estampa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Artista_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Artista" ("id") SELECT "id" FROM "Artista";
DROP TABLE "Artista";
ALTER TABLE "new_Artista" RENAME TO "Artista";
CREATE UNIQUE INDEX "Artista_usuarioId_key" ON "Artista"("usuarioId");
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "estadisticasId" INTEGER,
    CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cliente_estadisticasId_fkey" FOREIGN KEY ("estadisticasId") REFERENCES "Estadisticas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("estadisticasId", "id") SELECT "estadisticasId", "id" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_usuarioId_key" ON "Cliente"("usuarioId");
CREATE TABLE "new_Estampa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "popularidad" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "artistaId" INTEGER,
    "disponibleParaVenta" BOOLEAN NOT NULL,
    CONSTRAINT "Estampa_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Estampa" ("descripcion", "disponibleParaVenta", "id", "nombre", "popularidad", "rating", "tema") SELECT "descripcion", "disponibleParaVenta", "id", "nombre", "popularidad", "rating", "tema" FROM "Estampa";
DROP TABLE "Estampa";
ALTER TABLE "new_Estampa" RENAME TO "Estampa";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL
);
INSERT INTO "new_Usuario" ("contrasena", "email", "id", "nombre", "rol") SELECT "contrasena", "email", "id", "nombre", "rol" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_nombre_key" ON "Usuario"("nombre");
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
