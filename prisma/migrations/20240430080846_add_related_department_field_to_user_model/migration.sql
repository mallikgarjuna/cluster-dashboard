-- CreateEnum
CREATE TYPE "OSDepartmentShortName" AS ENUM ('BBT', 'BMS', 'ERIBA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "departmentId" INTEGER;

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "nameFull" TEXT NOT NULL,
    "nameShort" "OSDepartmentShortName" NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
