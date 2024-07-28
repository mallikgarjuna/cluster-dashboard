/*
  Warnings:

  - You are about to drop the column `fundingProgrammeId` on the `FundingCall` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FundingCall" DROP CONSTRAINT "FundingCall_fundingProgrammeId_fkey";

-- AlterTable
ALTER TABLE "FundingCall" DROP COLUMN "fundingProgrammeId",
ADD COLUMN     "fundingActionId" TEXT;

-- CreateTable
CREATE TABLE "FundingAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fundingProgrammeId" TEXT,

    CONSTRAINT "FundingAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FundingAction" ADD CONSTRAINT "FundingAction_fundingProgrammeId_fkey" FOREIGN KEY ("fundingProgrammeId") REFERENCES "FundingProgramme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingCall" ADD CONSTRAINT "FundingCall_fundingActionId_fkey" FOREIGN KEY ("fundingActionId") REFERENCES "FundingAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
