// "use server";
import "server-only";
// Server-utils (queries) for Grants

import prisma from "@/prisma/client";
import { Grant, StatusGrant } from "@prisma/client";

async function getGrantByGrantId(grantId: Grant["id"]) {
  const grant = await prisma.grant.findUnique({
    where: { id: grantId },
  });

  return grant;
}

async function fetchUniqueGrantYearsSA() {
  //   get all unique submission dates (not years, yet) - gives us an array of objects
  const grantsWithDates = await prisma.grant.findMany({
    select: { submissionDate: true, projectStartDate: true },
  });

  const years = new Set<number>();

  grantsWithDates.forEach((grantObj) => {
    if (grantObj.submissionDate)
      years.add(grantObj.submissionDate.getFullYear());
    if (grantObj.projectStartDate)
      years.add(grantObj.projectStartDate.getFullYear());
  });

  const uniqueYears = Array.from(years).sort((a, b) => a - b);

  // const grantsWithSubmissionDates = await prisma.grant.findMany({
  //   select: { submissionDate: true },
  // });

  // // Get all years
  // const grantSubmissionYearsAll = grantsWithSubmissionDates
  //   .map((grantObj) =>
  //     grantObj.submissionDate ? grantObj.submissionDate.getFullYear() : null,
  //   )
  //   .filter(Boolean)
  //   .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  // // get unique years
  // const uniqueGrantSubmissionYears = Array.from(
  //   new Set(grantSubmissionYearsAll),
  // );

  // const grantsWithStartDates = await prisma.grant.findMany({
  //   select: { projectStartDate: true },
  //   distinct: ["projectStartDate"],
  // });

  // const grantStartYearsAll = grantsWithStartDates
  //   .map((grantObj) =>
  //     grantObj.projectStartDate
  //       ? grantObj.projectStartDate.getFullYear()
  //       : null,
  //   )
  //   .filter(Boolean)
  //   .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  // const uniqueGrantStartYears = Array.from(new Set(grantStartYearsAll));

  // // grantYearsAll
  // const grantYearsAll = Array.from(
  //   new Set([...uniqueGrantSubmissionYears, ...uniqueGrantStartYears]),
  // );

  // return grantYearsAll;

  return uniqueYears;
}

// For PostgreSQL: use a more efficient raw query
// This approach is more efficient for large datasets as it performs the year extraction at the database level.
async function getUniqueGrantStartYears() {
  const uniqueStartYears = await prisma.$queryRaw<{ year: number }[]>`
    SELECT DISTINCT EXTRACT(YEAR FROM "projectStartDate") as year 
    FROM "Grant" 
    WHERE "projectStartDate" IS NOT NULL 
    ORDER BY year ASC`;

  return uniqueStartYears.map((entry) => Number(entry.year));
  // explicitly convert the years to numbers, although it may not be necessary if they are already being returned as numbers.

  // ***** don't use the prisma query - it's slow for large dbs ***
  // Get unique years using Prisma's date functions
  // const uniqueYears = await prisma.grant
  //   .findMany({
  //     select: {
  //       projectStartDate: true,
  //     },
  //     distinct: ["projectStartDate"],
  //     orderBy: {
  //       projectStartDate: "desc",
  //     },
  //   })
  //   .then((dates) =>
  //     // Filter out null dates and extract unique years
  //     dates
  //       .map((d) => d.projectStartDate)
  //       .filter((date): date is Date => date !== null)
  //       .map((date) => date.getFullYear())
  //       .sort((a, b) => a - b),
  //   );
  // return uniqueYears;
}

const getGrantStatuses = async () => {
  const grantStatuses = Object.values(StatusGrant);
  return grantStatuses;
};

// Export functions for use in other files
export {
  getGrantByGrantId,
  fetchUniqueGrantYearsSA,
  getUniqueGrantStartYears,
  getGrantStatuses,
};
