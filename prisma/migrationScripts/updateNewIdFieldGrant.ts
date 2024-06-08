// // // Create new column newId in Department
import prisma from "../client";

// // // Add newId to Grant
// async function main() {
//   const grants = await prisma.grant.findMany();

//   for (const grant of grants) {
//     await prisma.grant.update({
//       where: { id: grant.id },
//       data: { newId: grant.id.toString() },
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

// // // // Rename newId to Id in Department
// async function main() {
//     const grants = await prisma.grant.findMany();

//     for (const grant of grants) {
//       await prisma.grant.update({
//         where: { newId: grant.newId },
//         data: { id: grant.newId },
//       });
//     }
//   }

//   main()
//     .catch((e) => {
//       console.error(e);
//       process.exit(1);
//     })
//     .finally(async () => {
//       await prisma.$disconnect();
//     });
