"use server";
import prisma from "@/prisma/client";

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

// Export functions for use in other files
export { fetchUniqueGrantYearsSA };
