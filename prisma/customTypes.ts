import { Prisma } from "@prisma/client";

// Grant with User type
const grantWithUser = Prisma.validator<Prisma.GrantDefaultArgs>()({
  include: {
    assignedToUser: true,
  },
});

export type GrantWithUser = Prisma.GrantGetPayload<typeof grantWithUser>;

// Grant with ALL related types
const grantWihAllRelatedTypes = Prisma.validator<Prisma.GrantDefaultArgs>()({
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
  typeof grantWihAllRelatedTypes
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
