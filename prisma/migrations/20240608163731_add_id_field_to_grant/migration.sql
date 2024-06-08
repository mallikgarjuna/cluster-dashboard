/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Grant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Grant_id_key" ON "Grant"("id");
