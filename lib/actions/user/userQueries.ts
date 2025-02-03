"use server";
import prisma from "@/prisma/client";
import { getErrorMessage } from "../../utils";

// server action for fetching users
export async function fetchAllUsers() {
  try {
    const users = await prisma.user.findMany({ orderBy: { lastName: "asc" } });
    return {
      success: true,
      message: "Successfully fetched users",
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch users",
      error: getErrorMessage(error),
    };
  }
}

export const getGroupLeadersWithDepartment = async () => {
  const groupLeadersWithDepartment = await prisma.user.findMany({
    where: { role: "GROUPLEADER" },
    include: { relatedDepartment: true },
    orderBy: { lastName: "asc" },
  });

  return groupLeadersWithDepartment;
};
