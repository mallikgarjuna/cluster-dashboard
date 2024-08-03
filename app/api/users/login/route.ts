// API for user login
// for authorize() function in authOptions.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

// zod schema for user login
const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = UserLoginSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  // 400 = invalid request

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user)
    return NextResponse.json({ error: "User does not exist" }, { status: 404 });
  // 404 = not found

  const passwordsMatch = await bcrypt.compare(
    body.password,
    user?.hashedPassword!,
  );

  if (!passwordsMatch)
    return NextResponse.json(
      { error: "Password is not correct" },
      { status: 400 },
    );
  // 400: Bad request, meaning: the client sent invalid data

  if (!user.emailVerified) throw new Error("Please verify your email first.");

  return NextResponse.json(user);
}
