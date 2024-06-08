/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Department_id_key" ON "Department"("id");
