"use server";
import prisma from "@/prisma/client";

async function fetchUniqueGrantYearsSA() {
  //   get all unique submission dates (not years, yet) - gives us an array of objects
  const grantsWithDates = await prisma.grant.findMany({
    select: { submissionDate: true, projectStartDate: true },
    distinct: ["submissionDate"],
  });

  //   get all years from the submission dates
  const grantYears = grantsWithDates.map((grantObj) =>
    Object.values(grantObj)
      .map((dateVal) => (dateVal ? dateVal.getFullYear() : null))
      .filter(Boolean),
  );

  const grantYearsAll = grantYears
    .flat() //default: flat(1) - or use flat(Infinity) to flatten all levels
    .filter(Boolean)
    .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  // const grantYearsAll = grantsWithDates
  //   .map((grantObj) =>
  //     grantObj.submissionDate ? grantObj.submissionDate.getFullYear() : null,
  //   )
  //   .filter(Boolean)
  //   .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  // get unique years
  const uniqueGrantSubmissionYears = Array.from(new Set(grantYearsAll));

  return uniqueGrantSubmissionYears;
}

// Export functions for use in other files
export { fetchUniqueGrantYearsSA };
