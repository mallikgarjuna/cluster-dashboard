// // // Create new column newId in Department
import prisma from "../client";

// async function main() {
//   const departments = await prisma.department.findMany();

//   for (const department of departments) {
//     await prisma.department.update({
//       where: { id: department.id },
//       data: { newId: department.id.toString() },
//     });
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// // // Rename newId to Id in Department

async function main() {
  const departments = await prisma.department.findMany();

  for (const department of departments) {
    await prisma.department.update({
      where: { newId: department.newId },
      data: { id: department.newId },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
