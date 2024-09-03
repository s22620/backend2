/*
  Warnings:

  - Made the column `imageSrc` on table `trips` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "price" REAL NOT NULL,
    "imageSrc" TEXT NOT NULL
);
INSERT INTO "new_trips" ("description", "endDate", "id", "imageSrc", "price", "startDate", "title") SELECT "description", "endDate", "id", "imageSrc", "price", "startDate", "title" FROM "trips";
DROP TABLE "trips";
ALTER TABLE "new_trips" RENAME TO "trips";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
