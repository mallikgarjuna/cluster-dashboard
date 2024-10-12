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
const fundingAgencyWithProgrammesActionsCallsAndGrants =
  Prisma.validator<Prisma.FundingAgencyDefaultArgs>()({
    include: {
      grants: true,
      fundingProgrammes: {
        include: {
          grants: true,
          fundingActions: {
            include: {
              grants: true,
              fundingCalls: {
                include: {
                  grants: true,
                },
              },
            },
          },
        },
      },
    },
  });

export type FundingAgencyWithProgrammesActionsCallsAndGrants =
  Prisma.FundingAgencyGetPayload<
    typeof fundingAgencyWithProgrammesActionsCallsAndGrants
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

// FundingAgency with all its related types
const fundingAgencyWithAllRelatedTypes =
  Prisma.validator<Prisma.FundingAgencyDefaultArgs>()({
    include: {
      grants: true,
      fundingProgrammes: true,
    },
  });

export type FundingAgencyWithAllRelatedTypes = Prisma.FundingAgencyGetPayload<
  typeof fundingAgencyWithAllRelatedTypes
>;

// FundingProgramme with all its related types
const fundingProgrammeWithAllRelatedTypes =
  Prisma.validator<Prisma.FundingProgrammeDefaultArgs>()({
    include: {
      grants: true,
      fundingActions: true,
    },
  });

export type FundingProgrammeWithAllRelatedTypes =
  Prisma.FundingProgrammeGetPayload<typeof fundingProgrammeWithAllRelatedTypes>;

// FundingAction with all its related types
const fundingActionWithAllRelatedTypes =
  Prisma.validator<Prisma.FundingActionDefaultArgs>()({
    include: {
      grants: true,
      fundingCalls: true,
    },
  });

export type FundingActionWithAllRelatedTypes = Prisma.FundingActionGetPayload<
  typeof fundingActionWithAllRelatedTypes
>;

// FundingCall with all its related types
const fundingCallWithAllRelatedTypes =
  Prisma.validator<Prisma.FundingCallDefaultArgs>()({
    include: {
      grants: true,
    },
  });

export type FundingCallWithAllRelatedTypes = Prisma.FundingCallGetPayload<
  typeof fundingCallWithAllRelatedTypes
>;
