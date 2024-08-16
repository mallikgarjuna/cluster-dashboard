/*
  Warnings:

  - You are about to alter the column `fundingAgencyId` on the `Grant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "Grant" DROP CONSTRAINT "Grant_fundingAgencyId_fkey";

-- AlterTable
ALTER TABLE "Grant" ALTER COLUMN "fundingAgencyId" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_fundingAgencyId_fkey" FOREIGN KEY ("fundingAgencyId") REFERENCES "FundingAgency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
