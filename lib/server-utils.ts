import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth-no-edge";

// Auth utils =====================================
export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return session;
}
