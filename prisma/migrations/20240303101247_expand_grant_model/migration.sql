-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "acronym" TEXT,
ADD COLUMN     "budgetTotal" TEXT,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "decisionDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "submissionDate" TIMESTAMP(3);
