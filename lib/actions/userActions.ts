"use server";
import prisma from "@/prisma/client";

// server action for fetching users
export async function fetchUsers() {
  const users = await prisma.user.findMany({ orderBy: { lastName: "asc" } });
  return users;
}
