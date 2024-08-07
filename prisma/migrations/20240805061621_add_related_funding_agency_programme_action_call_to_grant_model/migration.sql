-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "fundingActionId" TEXT,
ADD COLUMN     "fundingAgencyId" TEXT,
ADD COLUMN     "fundingCallId" TEXT,
ADD COLUMN     "fundingProgrammeId" TEXT;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_fundingAgencyId_fkey" FOREIGN KEY ("fundingAgencyId") REFERENCES "FundingAgency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_fundingProgrammeId_fkey" FOREIGN KEY ("fundingProgrammeId") REFERENCES "FundingProgramme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_fundingActionId_fkey" FOREIGN KEY ("fundingActionId") REFERENCES "FundingAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_fundingCallId_fkey" FOREIGN KEY ("fundingCallId") REFERENCES "FundingCall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
