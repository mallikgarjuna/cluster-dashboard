-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "assignedToUserId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
