import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth";

// Auth utils =====================================
export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session;
}
