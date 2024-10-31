"use server";
import prisma from "@/prisma/client";

async function fetchUniqueGrantSubmitYears() {
  //   get all unique submission dates (not years, yet) - gives us an array of objects
  const grantSubmissionDates = await prisma.grant.findMany({
    select: { submissionDate: true },
    distinct: ["submissionDate"],
  });

  //   get all years from the submission dates
  const grantSubmissionYears = grantSubmissionDates
    .map((submitDateObj) =>
      submitDateObj.submissionDate
        ? submitDateObj.submissionDate.getFullYear()
        : null,
    )
    .filter(Boolean)
    .sort((a, b) => (a ?? 0) - (b ?? 0)); // Ensure a and b are not null

  // get unique years
  const uniqueGrantSubmissionYears = Array.from(new Set(grantSubmissionYears));

  return uniqueGrantSubmissionYears;
}

// Export functions for use in other files
export { fetchUniqueGrantSubmitYears };
