-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Estampa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "popularidad" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "artistaId" INTEGER,
    "disponibleParaVenta" BOOLEAN NOT NULL,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Estampa_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Estampa" ("artistaId", "descripcion", "disponibleParaVenta", "id", "nombre", "popularidad", "rating", "tema") SELECT "artistaId", "descripcion", "disponibleParaVenta", "id", "nombre", "popularidad", "rating", "tema" FROM "Estampa";
DROP TABLE "Estampa";
ALTER TABLE "new_Estampa" RENAME TO "Estampa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
