/*
  Warnings:

  - You are about to alter the column `budgetTotal` on the `Grant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Grant" ALTER COLUMN "budgetTotal" SET DEFAULT 0,
ALTER COLUMN "budgetTotal" SET DATA TYPE INTEGER;
