import { Prisma } from "@prisma/client";

// Grant with User type
const grantWithUser = Prisma.validator<Prisma.GrantDefaultArgs>()({
  include: {
    assignedToUser: true,
  },
});

export type GrantWithUser = Prisma.GrantGetPayload<typeof grantWithUser>;

// Grant with ALL related types
const grantWithAllRelatedTypes = Prisma.validator<Prisma.GrantDefaultArgs>()({
  include: {
    assignedToUser: true,
    createdByUser: true,
    relatedFundingAgency: true,
    relatedFundingProgramme: true,
    relatedFundingAction: true,
    relatedFundingCall: true,
  },
});

export type GrantWithAllRelatedTypes = Prisma.GrantGetPayload<
  typeof grantWithAllRelatedTypes
>;

// Grant with User and User with Department type
const grantWithUserWithDepartment = Prisma.validator<Prisma.GrantDefaultArgs>()(
  {
    include: {
      assignedToUser: {
        include: {
          relatedDepartment: true,
        },
      },
      relatedFundingCall: true,
    },
  },
);

export type GrantWithUserWithDepartment = Prisma.GrantGetPayload<
  typeof grantWithUserWithDepartment
>;

////////////////////////// User type //////////////////////////
// User with department type
const userWithDepartment = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    relatedDepartment: true,
  },
});

export type UserWithDepartment = Prisma.UserGetPayload<
  typeof userWithDepartment
>;

// FundingAgency with fundingProgrammes type
const fundingAgencyWithProgrammesAgenciesCalls =
  Prisma.validator<Prisma.FundingAgencyDefaultArgs>()({
    include: {
      fundingProgrammes: {
        include: {
          fundingActions: {
            include: {
              fundingCalls: true,
            },
          },
        },
      },
    },
  });

export type fundingAgencyWithProgrammesAgenciesCalls =
  Prisma.FundingAgencyGetPayload<
    typeof fundingAgencyWithProgrammesAgenciesCalls
  >;
