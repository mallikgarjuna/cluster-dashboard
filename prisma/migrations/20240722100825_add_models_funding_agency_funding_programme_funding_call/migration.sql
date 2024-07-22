-- CreateEnum
CREATE TYPE "enumLocalityType" AS ENUM ('REGIONAL', 'NATIONAL', 'EU', 'NON_EU');

-- CreateEnum
CREATE TYPE "enumSectorType" AS ENUM ('PUBLIC_SECTOR', 'PRIVATE_SECTOR', 'THIRD_SECTOR');

-- CreateTable
CREATE TABLE "FundingAgency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localityType" "enumLocalityType" NOT NULL,
    "sectorType" "enumSectorType" NOT NULL,
    "url" TEXT,

    CONSTRAINT "FundingAgency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingProgramme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fundingAgencyId" TEXT,

    CONSTRAINT "FundingProgramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingCall" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "fundingProgrammeId" TEXT,

    CONSTRAINT "FundingCall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FundingProgramme" ADD CONSTRAINT "FundingProgramme_fundingAgencyId_fkey" FOREIGN KEY ("fundingAgencyId") REFERENCES "FundingAgency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingCall" ADD CONSTRAINT "FundingCall_fundingProgrammeId_fkey" FOREIGN KEY ("fundingProgrammeId") REFERENCES "FundingProgramme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
