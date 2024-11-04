"use server";
import prisma from "@/prisma/client";

async function fetchUniqueGrantYearsSA() {
  //   get all unique submission dates (not years, yet) - gives us an array of objects
  const grantsWithSubmissionDates = await prisma.grant.findMany({
    select: { submissionDate: true },
    distinct: ["submissionDate"],
  });

  const grantsWithStartDates = await prisma.grant.findMany({
    select: { projectStartDate: true },
    distinct: ["projectStartDate"],
  });

  // Get all years
  const grantSubmissionYearsAll = grantsWithSubmissionDates
    .map((grantObj) =>
      grantObj.submissionDate ? grantObj.submissionDate.getFullYear() : null,
    )
    .filter(Boolean)
    .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  const grantStartYearsAll = grantsWithStartDates
    .map((grantObj) =>
      grantObj.projectStartDate
        ? grantObj.projectStartDate.getFullYear()
        : null,
    )
    .filter(Boolean)
    .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  // get unique years
  const uniqueGrantSubmissionYears = Array.from(
    new Set(grantSubmissionYearsAll),
  );

  const uniqueGrantStartYears = Array.from(new Set(grantStartYearsAll));

  // grantYearsAll
  const grantYearsAll = Array.from(
    new Set([...uniqueGrantSubmissionYears, ...uniqueGrantStartYears]),
  );

  return grantYearsAll;
}

// Export functions for use in other files
export { fetchUniqueGrantYearsSA };
