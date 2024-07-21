-- CreateEnum
CREATE TYPE "enumApplicantRole" AS ENUM ('MAIN_APPLICANT', 'CO_APPLICANT');

-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "applicantRole" "enumApplicantRole" NOT NULL DEFAULT 'MAIN_APPLICANT';
