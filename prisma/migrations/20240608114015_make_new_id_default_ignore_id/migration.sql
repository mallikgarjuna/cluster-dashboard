/*
  Warnings:

  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `newId` on table `Department` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_departmentId_fkey";

-- DropIndex
DROP INDEX "Department_newId_key";

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
ALTER COLUMN "id" DROP NOT NULL,
ALTER COLUMN "newId" SET NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("newId");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "departmentId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("newId") ON DELETE SET NULL ON UPDATE CASCADE;
