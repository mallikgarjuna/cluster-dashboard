-- CreateEnum
CREATE TYPE "StatusGrant" AS ENUM ('DRAFT', 'SUBMITTED', 'AWARDED', 'REJECTED', 'RUNNING_PROJECT', 'DELETED', 'ENDED_PROJECT');

-- CreateTable
CREATE TABLE "Grant" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusGrant" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);
