"use server";

import ActivateEmailTemplate from "@/emails/ActivateEmailTemplate";
import ResetPasswordEmailTemplate from "@/emails/ResetPasswordEmailTemplate";
import { Resend } from "resend";
import { z } from "zod";
import { getErrorMessage } from "../utils";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send activation email server action
const WelcomeEmailSchema = z.object({
  toEmail: z.string().email(),
  subject: z.string().min(1),
  firstName: z.string().min(1),
  activationUrl: z.string().url(),
});
type WelcomeEmailInputType = z.infer<typeof WelcomeEmailSchema>;

export async function sendActivationEmail(
  activationData: WelcomeEmailInputType
) {
  // TODO: addrate limit
  // TODO: add authorization

  const validation = WelcomeEmailSchema.safeParse(activationData);
  if (!validation.success) {
    return {
      success: false,
      message:
        "Missing activaion data. Failed to send Activation Email." +
        "\n" +
        getErrorMessage(validation.error),
      status: 400,
    };
  }

  const { toEmail, subject, firstName, activationUrl } = validation.data;

  const { data, error } = await resend.emails.send({
    from: "Cluster Dashboard <admin@clusterdashboard.com>", //add custom domain
    to: [toEmail],
    subject: subject,
    // react: WelcomeEmailTemplate({ firstName: firstName }),
    react: ActivateEmailTemplate({
      firstName: firstName,
      activationUrl: activationUrl,
    }),
  });

  if (error)
    return {
      success: false,
      message: "Failed to send Activation Email" + "\n" + error.message,
      status: 400,
    };

  //   return NextResponse.json(data, { status: 200 });
  return {
    success: true,
    message: "Activation Email sent successfully",
    status: 200,
  };
}

// Send reset password email server action
const ResetPasswordEmailSchema = z.object({
  toEmail: z.string().email(),
  subject: z.string().min(1),
  firstName: z.string().min(1),
  resetUrl: z.string().url(),
});
type ResetPasswordEmailInputType = z.infer<typeof ResetPasswordEmailSchema>;

export async function sendResetEmail(
  resetPasswordData: ResetPasswordEmailInputType
) {
  // TODO: addrate limit
  // TODO: add authorization

  const validation = ResetPasswordEmailSchema.safeParse(resetPasswordData);
  if (!validation.success) {
    return {
      success: false,
      message:
        "Missing activaion data. Failed to send reset Email." +
        "\n" +
        getErrorMessage(validation.error),
      status: 400,
    };
  }

  const { toEmail, subject, firstName, resetUrl } = validation.data;

  const { data, error } = await resend.emails.send({
    from: "Cluster Dashboard <admin@clusterdashboard.com>", //add custom domain
    to: [toEmail],
    subject: subject,
    // react: WelcomeEmailTemplate({ firstName: firstName }),
    react: ResetPasswordEmailTemplate({
      firstName: firstName,
      resetUrl: resetUrl,
    }),
  });

  if (error)
    return {
      success: false,
      message: "Failed to send reset Email" + "\n" + error.message,
      status: 400,
    };

  //   return NextResponse.json(data, { status: 200 });
  return {
    success: true,
    message: "Reset Email sent successfully",
    status: 200,
  };
}

// Exported in this action file:
// sendActivationEmail, sendResetEmail;
