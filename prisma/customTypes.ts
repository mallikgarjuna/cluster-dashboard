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

////////////////////////// Funder types //////////////////////////
// FundingAgency with all its relations(fundingProgrammes, fundingActions, fundingCalls) type
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

export type FundingAgencyWithProgrammesAgenciesCalls =
  Prisma.FundingAgencyGetPayload<
    typeof fundingAgencyWithProgrammesAgenciesCalls
  >;

// FundingProgramme with all its relations(fundingActions, fundingCalls) type
const fundingProgrammeWithActionsCalls =
  Prisma.validator<Prisma.FundingProgrammeDefaultArgs>()({
    include: {
      fundingActions: {
        include: {
          fundingCalls: true,
        },
      },
    },
  });

export type FundingProgrammeWithActionsCalls =
  Prisma.FundingProgrammeGetPayload<typeof fundingProgrammeWithActionsCalls>;

// FundingAction with all its relations(fundingCalls) type
const fundingActionWithCalls =
  Prisma.validator<Prisma.FundingActionDefaultArgs>()({
    include: {
      fundingCalls: true,
    },
  });

export type FundingActionWithCalls = Prisma.FundingActionGetPayload<
  typeof fundingActionWithCalls
>;
