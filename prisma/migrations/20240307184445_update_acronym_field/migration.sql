/*
  Warnings:

  - You are about to alter the column `acronym` on the `Grant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Grant" ALTER COLUMN "acronym" SET DATA TYPE VARCHAR(255);
