-- CreateEnum
CREATE TYPE "enumGroupMemberType" AS ENUM ('PI', 'POSTDOC', 'PHD', 'TECHNICIAN');

-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "groupMemberType" "enumGroupMemberType" DEFAULT 'PI';
