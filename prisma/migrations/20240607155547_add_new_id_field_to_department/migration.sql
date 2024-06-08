/*
  Warnings:

  - A unique constraint covering the columns `[newId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "newId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Department_newId_key" ON "Department"("newId");
