import ActivateEmailTemplate from "@/emails/ActivateEmailTemplate";
import WelcomeEmailTemplate from "@/emails/WelcomeEmailTemplate";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const WelcomeEmailSchema = z.object({
  toEmail: z.string().email(),
  firstName: z.string().min(1),
});

export async function POST(request: NextRequest) {
  // TODO: addrate limit
  // TODO: add authorization

  const body = await request.json();
  const validation = WelcomeEmailSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const { toEmail, firstName } = body;

  const { data, error } = await resend.emails.send({
    from: "Cluster Dashboard <noreply@clusterdashboard.com>", //add custom domain
    to: [toEmail],
    subject: "Activate your account",
    // react: WelcomeEmailTemplate({ firstName: firstName }),
    react: ActivateEmailTemplate({ name: firstName }),
  });

  if (error) return NextResponse.json(error, { status: 400 });

  //   return NextResponse.json(data, { status: 200 });
  return NextResponse.json(
    { message: "Email sent successfully" },
    { status: 200 }
  );
}
