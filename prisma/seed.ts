import prisma from "./client";
import { faker } from "@faker-js/faker";
import {
  OSDepartmentShortName,
  StatusGrant,
  UserRole,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

async function main() {
  // Don't run seed script in production!!
  // To secure production db safe: exit if not 'dev' env;
  console.log(process.env.NODE_ENV); // gives 'undefined', why?

  //   if (process.env.NODE_ENV !== "development") return;

  /**
   * Get a random value from an enum.
   * @template T The enum type.
   * @param {T} anEnum The enum object.
   * @returns {T[keyof T]} A random value from the enum.
   */
  const getRandomEnumValue = <T extends Record<string, string | number>>(
    anEnum: T,
  ): T[keyof T] => {
    const values = Object.values(anEnum) as T[keyof T][];
    return values[Math.floor(Math.random() * values.length)];
  };

  // function randomEnum<T>(anEnum: T): T[keyof T] {
  //   const enumValues = Object.keys(anEnum)
  //     .map((n) => Number.parseInt(n))
  //     .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
  //   return anEnum[enumValues[Math.floor(Math.random() * enumValues.length)]];
  // }

  const seedPassword = "admin123";
  const hashedPassword = await bcrypt.hash(seedPassword, 10);

  console.log("Upserting departments...");
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { id: "dept-bbt" },
      update: { nameFull: "BBT Department", nameShort: OSDepartmentShortName.BBT },
      create: {
        id: "dept-bbt",
        nameFull: "BBT Department",
        nameShort: OSDepartmentShortName.BBT,
      },
    }),
    prisma.department.upsert({
      where: { id: "dept-bms" },
      update: { nameFull: "BMS Department", nameShort: OSDepartmentShortName.BMS },
      create: {
        id: "dept-bms",
        nameFull: "BMS Department",
        nameShort: OSDepartmentShortName.BMS,
      },
    }),
    prisma.department.upsert({
      where: { id: "dept-eriba" },
      update: {
        nameFull: "ERIBA Department",
        nameShort: OSDepartmentShortName.ERIBA,
      },
      create: {
        id: "dept-eriba",
        nameFull: "ERIBA Department",
        nameShort: OSDepartmentShortName.ERIBA,
      },
    }),
  ]);

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

  console.log("Start deleting existing grants...");
  await prisma.grant.deleteMany();
  console.log("Finish deleting existing grants...");

  const today = new Date();
  console.log("Start seeding...");
  const assignedUsers = [adminUser, ...groupLeaders];

  for (let i = 0; i < 12; i++) {
    const assignedUser = assignedUsers[i % assignedUsers.length];

    const grant = await prisma.grant.create({
      data: {
        title: `Grant ${faker.location.country()} ${i + 1}`,
        description: `Description Grant: ${faker.lorem.lines(2)}`,
        status: getRandomEnumValue(StatusGrant) as StatusGrant,
        acronym: faker.location.country(),
        applicantFullName: faker.person.fullName(),
        budgetTotal: faker.number.int({ min: 10000, max: 100000 }),
        budgetAssignedToPI: faker.number.int({ min: 5000, max: 50000 }),
        submissionDate: faker.date.recent({ days: 7 }),
        deadline: faker.date.soon({ days: 7 }),
        decisionDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        projectStartDate: faker.date.soon({ days: 60 }),
        projectNumber: 1000 + i,
        notes: faker.lorem.lines(1),
        assignedToUserId: assignedUser.id,
        createdByUserId: adminUser.id,
      },
    });
    console.log(`Created a Grant with id: ${grant.id}`);
  }

  console.log("Finish seeding.");
  console.log(`Seeded password for local users: ${seedPassword}`);
  console.log(
    `Seeded departments: ${departments.map((department) => department.nameShort).join(", ")}`,
  );
}

main()
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
