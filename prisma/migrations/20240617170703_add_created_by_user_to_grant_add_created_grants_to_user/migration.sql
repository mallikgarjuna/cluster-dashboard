-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "createdByUserId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
