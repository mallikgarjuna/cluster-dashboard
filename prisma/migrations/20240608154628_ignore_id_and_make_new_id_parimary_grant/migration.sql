/*
  Warnings:

  - The primary key for the `Grant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `newId` on table `Grant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Grant_newId_key";

-- AlterTable
ALTER TABLE "Grant" DROP CONSTRAINT "Grant_pkey",
ALTER COLUMN "newId" SET NOT NULL,
ADD CONSTRAINT "Grant_pkey" PRIMARY KEY ("newId");
