import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const PIs = await prisma.user.findMany({
      where: { role: "GROUPLEADER" },
      select: {
        id: true,
        name: true,
        assignedGrants: {
          select: { status: true, budgetTotal: true, budgetAssignedToPI: true },
        },
      },
      orderBy: { lastName: "asc" },
    });

    const grantsData = PIs.map((pi) => {
      const totalSubmittedGrants = pi.assignedGrants.filter((grant) =>
        [
          "SUBMITTED",
          "REJECTED",
          "AWARDED",
          "RUNNING_PROJECT",
          "ENDED_PROJECT",
        ].includes(grant.status),
      );
      const submitted = totalSubmittedGrants.length;

      const awaiting = pi.assignedGrants.filter(
        (grant) => grant.status === "SUBMITTED",
      ).length;

      const totalAwardedGrants = pi.assignedGrants.filter((grant) =>
        ["AWARDED", "RUNNING_PROJECT", "ENDED_PROJECT"].includes(grant.status),
      );
      const awarded = totalAwardedGrants.length;

      const rejected = pi.assignedGrants.filter(
        (grant) => grant.status === "REJECTED",
      ).length;

      const successRate = Number(((awarded / submitted) * 100).toFixed(2));

      const budgetAppliedFor = totalSubmittedGrants.reduce(
        (accumulator, grant) => accumulator + (grant.budgetTotal ?? 0),
        0,
      );
      const budgetAwarded = totalAwardedGrants.reduce(
        (accumulator, grant) => accumulator + (grant.budgetAssignedToPI ?? 0),
        0,
      );

      return {
        piID: pi.id,
        pi: pi.name,
        submitted,
        awaiting,
        awarded,
        rejected,
        successRate,
        budgetAppliedFor,
        budgetAwarded,
      };
    });

    return NextResponse.json(grantsData);
  } catch (error) {
    console.error("Error fetching grants count of PI", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
