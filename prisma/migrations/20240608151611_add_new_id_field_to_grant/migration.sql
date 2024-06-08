/*
  Warnings:

  - A unique constraint covering the columns `[newId]` on the table `Grant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "newId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Grant_newId_key" ON "Grant"("newId");
