import { verifyJwt } from "@/lib/jwt";
import { ActivateUserDataType } from "./../../../validationSchemas";
import { NextRequest, NextResponse } from "next/server";

type ActivateUserFunction = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

const activateUser: ActivateUserFunction = async (jwtUserID) => {
  const payload = verifyJwt(jwtUserID);
  console.log(payload);
  if ("newUserId" in payload!) {
    const userId = payload.newUserId;
    const user = await prisma?.user.findUnique({ where: { id: userId } });
    if (!user) return "userNotExist";
    if (user.emailVerified) return "alreadyActivated";
    await prisma?.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });
    return "success";
  } else {
    throw new Error("Invalid payload, without 'newUserId' field");
  }
};

// API for activating user with jwt token
export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await activateUser(body.jwtUserId);
  return NextResponse.json(result);
}
