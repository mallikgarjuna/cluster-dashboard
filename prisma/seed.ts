import prisma from "./client";
import { faker } from "@faker-js/faker";

async function main() {
  // Don't run seed script in production!!
  // To secure production db safe: exit if not 'dev' env;
  console.log(process.env.NODE_ENV); // gives 'undefined', why?

  //   if (process.env.NODE_ENV !== "development") return;

  await prisma.grant.deleteMany();

  console.log("Start seeding...");
  for (let i = 0; i < 10; i++) {
    const grant = await prisma.grant.create({
      data: {
        title: `Grant ${faker.location.country()} `,
        description: `Description Grant: ${faker.lorem.lines(2)}`,
        status: "SUBMITTED",
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
