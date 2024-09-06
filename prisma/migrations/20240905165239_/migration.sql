-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "numAdults" INTEGER NOT NULL,
    "numChildren" INTEGER NOT NULL,
    CONSTRAINT "reservations_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reservations" ("email", "id", "numAdults", "numChildren", "tripId") SELECT "email", "id", "numAdults", "numChildren", "tripId" FROM "reservations";
DROP TABLE "reservations";
ALTER TABLE "new_reservations" RENAME TO "reservations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
