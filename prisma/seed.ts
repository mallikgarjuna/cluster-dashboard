import prisma from "./client";
import * as bcrypt from "bcryptjs";
import {
  OSDepartmentShortName,
  StatusGrant,
  UserRole,
  enumApplicantRole,
  enumGroupMemberType,
  enumLocalityType,
  enumSectorType,
} from "@prisma/client";

const seedPassword = "admin123";

const departmentsSeed = [
  {
    id: "dept-bbt",
    nameFull: "BBT Department",
    nameShort: OSDepartmentShortName.BBT,
  },
  {
    id: "dept-bms",
    nameFull: "BMS Department",
    nameShort: OSDepartmentShortName.BMS,
  },
  {
    id: "dept-eriba",
    nameFull: "ERIBA Department",
    nameShort: OSDepartmentShortName.ERIBA,
  },
];

const fundingAgencySeed = [
  {
    id: "agency-efsd",
    name: "EFSD",
    localityType: enumLocalityType.EU,
    sectorType: enumSectorType.THIRD_SECTOR,
    url: "https://www.easd.org/efsd",
  },
  {
    id: "agency-ejprd",
    name: "EU/EU Joint Programme on RareDiseases(EJPRD)",
    localityType: enumLocalityType.EU,
    sectorType: enumSectorType.PUBLIC_SECTOR,
    url: "https://www.ejprarediseases.org",
  },
  {
    id: "agency-h2020",
    name: "EU/H2020",
    localityType: enumLocalityType.EU,
    sectorType: enumSectorType.PUBLIC_SECTOR,
    url: "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-2020_en",
  },
  {
    id: "agency-horizon-europe",
    name: "EU/Horizon-Europe",
    localityType: enumLocalityType.EU,
    sectorType: enumSectorType.PUBLIC_SECTOR,
    url: "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en",
  },
];

const fundingProgrammeSeed = [
  {
    id: "programme-efsd-grant-programmes",
    name: "EFSD - Grant Programmes",
    fundingAgencyId: "agency-efsd",
  },
  {
    id: "programme-efsd-young-investigators",
    name: "EFSD - Programmes for Young Investigators",
    fundingAgencyId: "agency-efsd",
  },
  {
    id: "programme-ejprd-jtc",
    name: "EU - EJP RD - Joint Translational Call (JTC)",
    fundingAgencyId: "agency-ejprd",
  },
  {
    id: "programme-h2020-pillar-1",
    name: "Pillar-1",
    fundingAgencyId: "agency-h2020",
  },
  {
    id: "programme-he-pillar-1",
    name: "Pillar-1 (Excellent Science)",
    fundingAgencyId: "agency-horizon-europe",
  },
  {
    id: "programme-he-pillar-2",
    name: "Pillar-2 (Global Challenges & Industrial Com)",
    fundingAgencyId: "agency-horizon-europe",
  },
];

const fundingActionSeed = [
  {
    id: "action-efsd-sanofi-edrp",
    name: "EFSD - Sanofi EDRP on autoimmunity in T1D",
    fundingProgrammeId: "programme-efsd-grant-programmes",
  },
  {
    id: "action-ejprd-jtc",
    name: "EU - EJP RD - Joint Translational Call (JTC)",
    fundingProgrammeId: "programme-ejprd-jtc",
  },
  {
    id: "action-msca-h2020",
    name: "MSCA-H2020",
    fundingProgrammeId: "programme-h2020-pillar-1",
  },
  {
    id: "action-erc",
    name: "ERC",
    fundingProgrammeId: "programme-he-pillar-1",
  },
  {
    id: "action-msca",
    name: "MSCA",
    fundingProgrammeId: "programme-he-pillar-1",
  },
  {
    id: "action-research-infrastructures",
    name: "Research Infrastructures (RI)",
    fundingProgrammeId: "programme-he-pillar-1",
  },
  {
    id: "action-cluster-1-health",
    name: "Cluster-1: Health",
    fundingProgrammeId: "programme-he-pillar-2",
  },
  {
    id: "action-cluster-2-culture",
    name: "Cluster-2: Culture, Creativity & Inclusive Soc",
    fundingProgrammeId: "programme-he-pillar-2",
  },
  {
    id: "action-cluster-3-civil-security",
    name: "Cluster-3: Civil Security for Society",
    fundingProgrammeId: "programme-he-pillar-2",
  },
  {
    id: "action-cluster-4-digital",
    name: "Cluster-4: Digital, Industry & Space",
    fundingProgrammeId: "programme-he-pillar-2",
  },
];

const fundingCallSeed = [
  {
    id: "call-efsd-sanofi-t1d-2024",
    name: "EFSD - Sanofi EDRP T1D - 2024",
    url: "https://www.easd.org/efsd/grants-and-fellowships.html",
    fundingActionId: "action-efsd-sanofi-edrp",
  },
  {
    id: "call-ejprd-jtc-2020",
    name: "EU - EJP RD - JTC-2020",
    url: "https://www.ejprarediseases.org/jtc2020/",
    fundingActionId: "action-ejprd-jtc",
  },
  {
    id: "call-h2020-msca-rise-2020",
    name: "H2020-MSCA-RISE-2020",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/msca-rise-2020",
    fundingActionId: "action-msca-h2020",
  },
  {
    id: "call-erc-stg-2022",
    name: "ERC-StG-2022",
    url: "https://erc.europa.eu/funding/starting-grants",
    fundingActionId: "action-erc",
  },
  {
    id: "call-erc-stg-2024",
    name: "ERC-StG-2024",
    url: "https://erc.europa.eu/funding/starting-grants",
    fundingActionId: "action-erc",
  },
  {
    id: "call-erc-stg-2025",
    name: "ERC-StG-2025",
    url: "https://erc.europa.eu/funding/starting-grants",
    fundingActionId: "action-erc",
  },
  {
    id: "call-erc-syg-2023",
    name: "ERC-2023-SyG",
    url: "https://erc.europa.eu/funding/synergy-grants",
    fundingActionId: "action-erc",
  },
  {
    id: "call-msca-pf-2021",
    name: "HORIZON-MSCA-2021-PF-01-01",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-msca",
  },
  {
    id: "call-msca-pf-2022",
    name: "HORIZON-MSCA-2022-PF-01-01",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-msca",
  },
  {
    id: "call-msca-pf-2023",
    name: "HORIZON-MSCA-2023-PF-01",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-msca",
  },
  {
    id: "call-msca-pf-2024",
    name: "HORIZON-MSCA-2024-PF-01-01",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-msca",
  },
  {
    id: "call-msca-dn-2024",
    name: "HORIZON-MSCA-2024-DN-01-01",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-msca",
  },
  {
    id: "call-hlth-tool-11-02",
    name: "HORIZON-HLTH-2024-TOOL-11-02",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-cluster-1-health",
  },
  {
    id: "call-hlth-tool-05-06",
    name: "HORIZON-HLTH-2024-TOOL-05-06-two-stage",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-cluster-1-health",
  },
  {
    id: "call-cl4-resilience-01-36",
    name: "HORIZON-CL4-2024-RESILIENCE-01-36",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    fundingActionId: "action-cluster-4-digital",
  },
];

const sampleGrantSeed = [
  {
    id: "seed-grant-erc-stg-2025",
    title: "Single-cell resilience mechanisms in tissue repair",
    acronym: "SC-REPAIR",
    description:
      "Sample seeded grant linked to Horizon Europe ERC Starting Grant 2025.",
    applicantFullName: "Ada Lovelace",
    groupMemberType: enumGroupMemberType.PI,
    applicantRole: enumApplicantRole.MAIN_APPLICANT,
    isBudgetApproved: true,
    budgetTotal: 1500000,
    budgetAssignedToPI: 900000,
    fundingAgency: "EU/Horizon-Europe",
    fundingProgramme: "Pillar-1 (Excellent Science)",
    fundingAction: "ERC",
    fundingCall: "ERC-StG-2025",
    urlFundingCall: "https://erc.europa.eu/funding/starting-grants",
    submissionDate: new Date("2025-10-15T00:00:00.000Z"),
    deadline: new Date("2025-10-29T00:00:00.000Z"),
    decisionDate: new Date("2026-04-15T00:00:00.000Z"),
    status: StatusGrant.SUBMITTED,
    projectStartDate: new Date("2026-09-01T00:00:00.000Z"),
    projectEndDate: new Date("2031-08-31T00:00:00.000Z"),
    projectNumber: 5101,
    notes: "Representative seeded record for local development.",
    fundingAgencyId: "agency-horizon-europe",
    fundingProgrammeId: "programme-he-pillar-1",
    fundingActionId: "action-erc",
    fundingCallId: "call-erc-stg-2025",
  },
  {
    id: "seed-grant-msca-pf-2024",
    title: "Mitochondrial signaling in precision immunology",
    acronym: "MITO-IMMUNE",
    description:
      "Sample seeded grant linked to the Horizon Europe MSCA Postdoctoral Fellowship 2024 call.",
    applicantFullName: "Marie Curie",
    groupMemberType: enumGroupMemberType.POSTDOC,
    applicantRole: enumApplicantRole.MAIN_APPLICANT,
    isBudgetApproved: false,
    budgetTotal: 210000,
    budgetAssignedToPI: 40000,
    fundingAgency: "EU/Horizon-Europe",
    fundingProgramme: "Pillar-1 (Excellent Science)",
    fundingAction: "MSCA",
    fundingCall: "HORIZON-MSCA-2024-PF-01-01",
    urlFundingCall: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    submissionDate: new Date("2024-08-20T00:00:00.000Z"),
    deadline: new Date("2024-09-11T00:00:00.000Z"),
    decisionDate: new Date("2025-02-15T00:00:00.000Z"),
    status: StatusGrant.DRAFT,
    projectStartDate: new Date("2025-09-01T00:00:00.000Z"),
    projectEndDate: new Date("2027-08-31T00:00:00.000Z"),
    projectNumber: 5102,
    notes: "Representative seeded record for local development.",
    fundingAgencyId: "agency-horizon-europe",
    fundingProgrammeId: "programme-he-pillar-1",
    fundingActionId: "action-msca",
    fundingCallId: "call-msca-pf-2024",
  },
  {
    id: "seed-grant-hlth-tool-11-02",
    title: "AI-assisted biomarkers for adaptive cancer therapy",
    acronym: "AIBIO-CARE",
    description:
      "Sample seeded grant linked to the Horizon Europe Cluster 1 Health call.",
    applicantFullName: "Rosalind Franklin",
    groupMemberType: enumGroupMemberType.PI,
    applicantRole: enumApplicantRole.CO_APPLICANT,
    isBudgetApproved: false,
    budgetTotal: 3200000,
    budgetAssignedToPI: 650000,
    fundingAgency: "EU/Horizon-Europe",
    fundingProgramme: "Pillar-2 (Global Challenges & Industrial Com)",
    fundingAction: "Cluster-1: Health",
    fundingCall: "HORIZON-HLTH-2024-TOOL-11-02",
    urlFundingCall: "https://ec.europa.eu/info/funding-tenders/opportunities/portal",
    submissionDate: new Date("2024-03-01T00:00:00.000Z"),
    deadline: new Date("2024-04-18T00:00:00.000Z"),
    decisionDate: new Date("2024-11-15T00:00:00.000Z"),
    status: StatusGrant.AWARDED,
    projectStartDate: new Date("2025-01-01T00:00:00.000Z"),
    projectEndDate: new Date("2029-12-31T00:00:00.000Z"),
    projectNumber: 5103,
    notes: "Representative seeded record for local development.",
    fundingAgencyId: "agency-horizon-europe",
    fundingProgrammeId: "programme-he-pillar-2",
    fundingActionId: "action-cluster-1-health",
    fundingCallId: "call-hlth-tool-11-02",
  },
  {
    id: "seed-grant-efsd-2024",
    title: "Beta-cell stress responses in type 1 diabetes",
    acronym: "BETA-STRESS",
    description:
      "Sample seeded grant linked to the EFSD Sanofi EDRP T1D 2024 call.",
    applicantFullName: "Frederick Banting",
    groupMemberType: enumGroupMemberType.PI,
    applicantRole: enumApplicantRole.MAIN_APPLICANT,
    isBudgetApproved: true,
    budgetTotal: 180000,
    budgetAssignedToPI: 120000,
    fundingAgency: "EFSD",
    fundingProgramme: "EFSD - Grant Programmes",
    fundingAction: "EFSD - Sanofi EDRP on autoimmunity in T1D",
    fundingCall: "EFSD - Sanofi EDRP T1D - 2024",
    urlFundingCall: "https://www.easd.org/efsd/grants-and-fellowships.html",
    submissionDate: new Date("2024-05-10T00:00:00.000Z"),
    deadline: new Date("2024-06-20T00:00:00.000Z"),
    decisionDate: new Date("2024-09-30T00:00:00.000Z"),
    status: StatusGrant.RUNNING_PROJECT,
    projectStartDate: new Date("2024-11-01T00:00:00.000Z"),
    projectEndDate: new Date("2027-10-31T00:00:00.000Z"),
    projectNumber: 5104,
    notes: "Representative seeded record for local development.",
    fundingAgencyId: "agency-efsd",
    fundingProgrammeId: "programme-efsd-grant-programmes",
    fundingActionId: "action-efsd-sanofi-edrp",
    fundingCallId: "call-efsd-sanofi-t1d-2024",
  },
];

const normalizeFundingValue = (value: string | null | undefined): string =>
  (value ?? "").trim().toLowerCase();

type FundingLookup = {
  agencyId?: string;
  programmeId?: string;
  actionId?: string;
  callId?: string;
  urlFundingCall?: string;
};

async function main() {
  console.log(`NODE_ENV=${process.env.NODE_ENV ?? "undefined"}`);

  const hashedPassword = await bcrypt.hash(seedPassword, 10);

  console.log("Upserting departments...");
  const departments = await Promise.all(
    departmentsSeed.map((department) =>
      prisma.department.upsert({
        where: { id: department.id },
        update: {
          nameFull: department.nameFull,
          nameShort: department.nameShort,
        },
        create: department,
      }),
    ),
  );

  console.log("Upserting local users...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      firstName: "Admin",
      lastName: "User",
      name: "Admin User",
      hashedPassword,
      emailVerified: new Date(),
      role: UserRole.ADMIN,
      departmentId: "dept-eriba",
    },
    create: {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      name: "Admin User",
      hashedPassword,
      emailVerified: new Date(),
      role: UserRole.ADMIN,
      departmentId: "dept-eriba",
    },
  });

  const groupLeaders = await Promise.all([
    prisma.user.upsert({
      where: { email: "gl-bbt@example.com" },
      update: {
        firstName: "BBT",
        lastName: "Leader",
        name: "BBT Leader",
        hashedPassword,
        emailVerified: new Date(),
        role: UserRole.GROUPLEADER,
        departmentId: "dept-bbt",
      },
      create: {
        email: "gl-bbt@example.com",
        firstName: "BBT",
        lastName: "Leader",
        name: "BBT Leader",
        hashedPassword,
        emailVerified: new Date(),
        role: UserRole.GROUPLEADER,
        departmentId: "dept-bbt",
      },
    }),
    prisma.user.upsert({
      where: { email: "gl-bms@example.com" },
      update: {
        firstName: "BMS",
        lastName: "Leader",
        name: "BMS Leader",
        hashedPassword,
        emailVerified: new Date(),
        role: UserRole.GROUPLEADER,
        departmentId: "dept-bms",
      },
      create: {
        email: "gl-bms@example.com",
        firstName: "BMS",
        lastName: "Leader",
        name: "BMS Leader",
        hashedPassword,
        emailVerified: new Date(),
        role: UserRole.GROUPLEADER,
        departmentId: "dept-bms",
      },
    }),
    prisma.user.upsert({
      where: { email: "gl-eriba@example.com" },
      update: {
        firstName: "ERIBA",
        lastName: "Leader",
        name: "ERIBA Leader",
        hashedPassword,
        emailVerified: new Date(),
        role: UserRole.GROUPLEADER,
        departmentId: "dept-eriba",
      },
      create: {
        email: "gl-eriba@example.com",
        firstName: "ERIBA",
        lastName: "Leader",
        name: "ERIBA Leader",
        hashedPassword,
        emailVerified: new Date(),
        role: UserRole.GROUPLEADER,
        departmentId: "dept-eriba",
      },
    }),
  ]);

  console.log("Upserting funding agencies...");
  await Promise.all(
    fundingAgencySeed.map((agency) =>
      prisma.fundingAgency.upsert({
        where: { id: agency.id },
        update: {
          name: agency.name,
          localityType: agency.localityType,
          sectorType: agency.sectorType,
          url: agency.url,
        },
        create: agency,
      }),
    ),
  );

  console.log("Upserting funding programmes...");
  await Promise.all(
    fundingProgrammeSeed.map((programme) =>
      prisma.fundingProgramme.upsert({
        where: { id: programme.id },
        update: {
          name: programme.name,
          fundingAgencyId: programme.fundingAgencyId,
        },
        create: programme,
      }),
    ),
  );

  console.log("Upserting funding actions...");
  await Promise.all(
    fundingActionSeed.map((action) =>
      prisma.fundingAction.upsert({
        where: { id: action.id },
        update: {
          name: action.name,
          fundingProgrammeId: action.fundingProgrammeId,
        },
        create: action,
      }),
    ),
  );

  console.log("Upserting funding calls...");
  await Promise.all(
    fundingCallSeed.map((call) =>
      prisma.fundingCall.upsert({
        where: { id: call.id },
        update: {
          name: call.name,
          url: call.url,
          fundingActionId: call.fundingActionId,
        },
        create: call,
      }),
    ),
  );

  const agencyLookup = new Map(
    fundingAgencySeed.map((agency) => [normalizeFundingValue(agency.name), agency.id]),
  );
  const programmeLookup = new Map(
    fundingProgrammeSeed.map((programme) => [
      normalizeFundingValue(programme.name),
      programme.id,
    ]),
  );
  const actionLookup = new Map(
    fundingActionSeed.map((action) => [normalizeFundingValue(action.name), action.id]),
  );
  const callLookup = new Map(
    fundingCallSeed.map((call) => [
      normalizeFundingValue(call.name),
      { callId: call.id, urlFundingCall: call.url ?? undefined },
    ]),
  );

  console.log("Upserting sample grants without deleting existing grants...");
  const assignedUsers = [adminUser, ...groupLeaders];

  for (let index = 0; index < sampleGrantSeed.length; index += 1) {
    const grant = sampleGrantSeed[index];
    const assignedUser = assignedUsers[index % assignedUsers.length];

    await prisma.grant.upsert({
      where: { id: grant.id },
      update: {
        ...grant,
        assignedToUserId: assignedUser.id,
        createdByUserId: adminUser.id,
      },
      create: {
        ...grant,
        assignedToUserId: assignedUser.id,
        createdByUserId: adminUser.id,
      },
    });
  }

  console.log("Backfilling existing grants with matching funding relations...");
  const existingGrants = await prisma.grant.findMany({
    select: {
      id: true,
      fundingAgency: true,
      fundingProgramme: true,
      fundingAction: true,
      fundingCall: true,
      urlFundingCall: true,
      fundingAgencyId: true,
      fundingProgrammeId: true,
      fundingActionId: true,
      fundingCallId: true,
    },
  });

  let backfilledGrantCount = 0;

  for (const grant of existingGrants) {
    const matchedFunding: FundingLookup = {
      agencyId: agencyLookup.get(normalizeFundingValue(grant.fundingAgency)),
      programmeId: programmeLookup.get(normalizeFundingValue(grant.fundingProgramme)),
      actionId: actionLookup.get(normalizeFundingValue(grant.fundingAction)),
      ...callLookup.get(normalizeFundingValue(grant.fundingCall)),
    };

    const updateData: FundingLookup = {};

    if (!grant.fundingAgencyId && matchedFunding.agencyId) {
      updateData.agencyId = matchedFunding.agencyId;
    }
    if (!grant.fundingProgrammeId && matchedFunding.programmeId) {
      updateData.programmeId = matchedFunding.programmeId;
    }
    if (!grant.fundingActionId && matchedFunding.actionId) {
      updateData.actionId = matchedFunding.actionId;
    }
    if (!grant.fundingCallId && matchedFunding.callId) {
      updateData.callId = matchedFunding.callId;
    }
    if (!grant.urlFundingCall && matchedFunding.urlFundingCall) {
      updateData.urlFundingCall = matchedFunding.urlFundingCall;
    }

    if (Object.keys(updateData).length === 0) {
      continue;
    }

    await prisma.grant.update({
      where: { id: grant.id },
      data: {
        fundingAgencyId: updateData.agencyId,
        fundingProgrammeId: updateData.programmeId,
        fundingActionId: updateData.actionId,
        fundingCallId: updateData.callId,
        urlFundingCall: updateData.urlFundingCall,
      },
    });
    backfilledGrantCount += 1;
  }

  console.log("Finish seeding.");
  console.log(`Seeded password for local users: ${seedPassword}`);
  console.log(
    `Seeded departments: ${departments.map((department) => department.nameShort).join(", ")}`,
  );
  console.log(
    `Seeded funding hierarchy: ${fundingAgencySeed.length} agencies, ${fundingProgrammeSeed.length} programmes, ${fundingActionSeed.length} actions, ${fundingCallSeed.length} calls.`,
  );
  console.log(`Seeded sample grants: ${sampleGrantSeed.length}`);
  console.log(`Backfilled existing grants: ${backfilledGrantCount}`);
}

main()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
