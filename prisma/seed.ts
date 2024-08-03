import prisma from "./client";
import { faker } from "@faker-js/faker";
import { StatusGrant } from "@prisma/client";

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

  console.log("Start deleting all grants in test db...");
  // await prisma.grant.deleteMany();
  console.log("Finish deleting all grants in test db...");

  const today = new Date();
  console.log("Start seeding...");
  for (let i = 0; i < 10; i++) {
    const grant = await prisma.grant.create({
      data: {
        title: `Grant ${faker.location.country()} `,
        description: `Description Grant: ${faker.lorem.lines(2)}`,
        status: `${getRandomEnumValue(StatusGrant)}`,
        acronym: `${faker.location.country()}`,
        budgetTotal: faker.number.int({ min: 10000, max: 100000 }),
        submissionDate: faker.date.recent({ days: 7 }),
        deadline: faker.date.soon({ days: 7 }),
        decisionDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        notes: faker.lorem.lines(1),
      },
    });
    console.log(`Created a Grant with id: ${grant.id}`);
  }

  console.log("Finish seeding.");
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
