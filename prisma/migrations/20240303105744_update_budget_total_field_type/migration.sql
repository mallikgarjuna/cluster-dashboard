/*
  Warnings:

  - The `budgetTotal` column on the `Grant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Grant" DROP COLUMN "budgetTotal",
ADD COLUMN     "budgetTotal" DOUBLE PRECISION;
