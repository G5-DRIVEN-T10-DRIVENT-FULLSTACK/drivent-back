/*
  Warnings:

  - You are about to drop the column `currentCapacity` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `maxCapacity` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "currentCapacity",
DROP COLUMN "maxCapacity",
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 27;
