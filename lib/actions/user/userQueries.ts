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
// Similar to React Query's hook earlier created
// - but not using it anymore;
// const useUsersWithDepartment = () =>
//   useQuery<UserWithDepartment[]>({
//     queryKey: ["usersWithDepartment"],
//     queryFn: () =>
//       axios.get("/api/users/withdepartment").then((res) => res.data),
//     staleTime: 60 * 1000, //60s
//     retry: 3,
//   });
