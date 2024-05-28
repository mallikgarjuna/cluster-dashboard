import { Prisma } from "@prisma/client";

// Grant with User type
const grantWithUser = Prisma.validator<Prisma.GrantDefaultArgs>()({
  include: {
    assignedToUser: true,
  },
});

export type GrantWithUser = Prisma.GrantGetPayload<typeof grantWithUser>;

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
  }
);

export type GrantWithUserWithDepartment = Prisma.GrantGetPayload<
  typeof grantWithUserWithDepartment
>;
