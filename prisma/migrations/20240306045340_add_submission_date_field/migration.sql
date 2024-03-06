/*
  Warnings:

  - You are about to drop the column `acronym` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `budgetTotal` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `decisionDate` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Grant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Grant" DROP COLUMN "acronym",
DROP COLUMN "budgetTotal",
DROP COLUMN "deadline",
DROP COLUMN "decisionDate",
DROP COLUMN "notes";
