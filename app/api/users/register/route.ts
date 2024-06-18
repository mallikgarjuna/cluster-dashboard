import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { SignupFormSchema } from "@/app/validationSchemas";
import axios from "axios";
import { signJwt } from "@/lib/jwt";

// const UserRegistrationSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(5),
// });

// Instead of this API, use the registerUser() server action;
export async function POST(request: NextRequest) {
  const body = await request.json();

  // In body, we have to make sure that we've a valid email and pswd
  // use zod
  // const validation = UserRegistrationSchema.safeParse(body);
  const validation = SignupFormSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  // 400 = invalid request

  // if valid, make sure that we don't have a user w/ same email
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  // if user doesn' exist, create a user
  // to do that, first we have to hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      hashedPassword,
      firstName: body.firstName,
      lastName: body.lastName,
    },
  });

  // if user is created, send an activation email with a link to the auth/activation page
  // encrypt the userId with jwt:
  const jwtUserId = signJwt({ newUserId: newUser.id });

  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
  const activationData = {
    toEmail: newUser.email,
    subject: "Activate your account",
    firstName: newUser.firstName,
    activationUrl: activationUrl,
  };
  await axios.post(`${process.env.NEXTAUTH_URL}/api/sendEmail`, activationData);

  //   Finally return a basic response to the client
  //   obvisouly, don't return the hashedpwd for security reasons
  return NextResponse.json({ email: newUser.email });
}
