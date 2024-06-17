"use server";
import {
  CreateUserFormInputType,
  CreateUserFormSchema,
  ForgotPasswordFormInputType,
  SigninFormInputType,
  SigninFormSchema,
  SignupFormInputType,
  SignupFormSchema,
} from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { signJwt, verifyJwt } from "../jwt";
import axios from "axios";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { sendActivationEmail, sendResetEmail } from "./mailActions";
import { getErrorMessage } from "../utils";
import { revalidatePath, revalidateTag } from "next/cache";

// register user action
export async function registerUser(signupFormData: SignupFormInputType) {
  // In the received data, we have to make sure that we've a valid email and pswd
  const validatedFields = SignupFormSchema.safeParse(signupFormData);
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to create user." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { firstName, lastName, email, password } = validatedFields.data;

  // if valid, make sure that we don't have a user w/ same email
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (user) {
    return {
      success: false,
      message: "User already exists. Failed to create user.",
    };
  }

  // if user doesn' exist, create a user
  const hashedPassword = await bcrypt.hash(password, 10);

  //Used 'var' instead of 'const/let' so that I can access 'newUser' ourside try-catch block
  try {
    var newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        "Database error: Failed to create user." +
        "\n" +
        getErrorMessage(error),
    };
  }

  // if user is created, send an activation email with a link to the auth/activation page
  // encrypt the userId with jwt:
  const jwtUserId = signJwt({ newUserId: newUser.id });

  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
  const activationData = {
    toEmail: newUser.email!,
    subject: "Activate your account",
    firstName: newUser.firstName!,
    activationUrl: activationUrl,
  };
  //   await axios.post(`${process.env.NEXTAUTH_URL}/api/sendEmail`, activationData);
  const activationResult = await sendActivationEmail(activationData); // calling server action, instead of api
  if (activationResult.success === false) {
    return {
      success: false,
      message:
        "Failed to send activation email. Failed to create user." +
        "\n" +
        activationResult.message,
    };
  }

  //   Finally return a basic response to the client
  //   obvisouly, don't return the hashedpwd for security reasons
  return {
    success: true,
    message: "User created. Activation email sent.",
    email: newUser.email,
  };

  redirect("/");
}

// Create user by admin
export async function createUserByAdmin(
  createUserFormData: CreateUserFormInputType
) {
  // validate
  const validatedFields = CreateUserFormSchema.safeParse(createUserFormData);
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to create user." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { firstName, lastName, email, password, role, departmentId } =
    validatedFields.data;
  const name = `${firstName} ${lastName}`;

  // If valid, make sure that we don't have a user w/ same email
  const user = await prisma?.user.findUnique({
    where: { email: email },
  });
  if (user) {
    return {
      success: false,
      message: "User already exists. Failed to create user.",
    };
  }

  // if user doesn't exists, create a user
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    var newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
        name: name,
        role,
        departmentId: departmentId,
      },
    });

    revalidatePath(`/dashboard`);

    // revalidate the cache for the react-queries
    revalidateTag("usersWithDepartment");
    revalidateTag("usersInGrantForm");
    revalidateTag("usersInAssigneeSelect");
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to create user." +
        "\n" +
        getErrorMessage(error),
    };
  }

  // If user is created, send an activation email to ADMIN(NOT USER) with a link to the auth/activation page
  // encrypt the userId with jwt
  const jwtUserId = signJwt({ newUserId: newUser.id });

  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
  const activationData = {
    toEmail: "m.gurram@rug.nl", //Admin email hardcoded
    subject: "Activate account: Created new user for " + newUser.email,
    firstName: "Admin",
    activationUrl: activationUrl,
  };
  const activationResult = await sendActivationEmail(activationData);
  if (!activationResult.success) {
    return {
      success: false,
      message:
        "Failed to send activation email. Failed to create user by Admin." +
        "\n" +
        activationResult.message,
    };
  }

  // Finally, return a basic response to the client
  //  obviously, don't return the hashed password of the new user for security reasons
  return {
    success: true,
    message:
      "User created successfully by Admin. Activation email sent to Admin.",
    email: newUser.email,
  };
}

// TODO: (not used it yet) signin user action b/c signIn() is a client-side function;
export async function loginUser(signinFormData: SigninFormInputType) {
  // In the received data, we have to make sure that we've a valid email and pswd
  const validatedFields = SigninFormSchema.safeParse(signinFormData);
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to sign in user." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { email, password } = validatedFields.data;

  try {
    // Here signIn() is a client-side function and cannot work in server-side here; so throws an error;
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (result?.error) {
      return {
        success: false,
        message: "Failed to sign in user",
      };
    } else {
      return {
        success: true,
        message: "Logged in successfully!",
      };
    }
  } catch (error) {
    return {
      message: "Database error: Failed to sign in user.",
    };
  }
}

// Activate user server action (called in auth/activation/[jwt]/page.tsx)
type ActivateUserFunction = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

export const activateUser: ActivateUserFunction = async (jwtUserID) => {
  const payload = verifyJwt(jwtUserID);
  // console.log(payload);
  if (!payload) return "userNotExist";

  // if ("newUserId" in payload) {
  const userId = payload.newUserId;
  const user = await prisma?.user.findUnique({ where: { id: userId } });
  if (!user) return "userNotExist";

  if (user.emailVerified) return "alreadyActivated";

  const result = await prisma?.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });
  if (result) return "success";
  else throw new Error("Something went wrong...");
  // } else {
  //   throw new Error("Invalid payload, without 'newUserId' field");
  // }
};

// forgot Password server action
export async function forgotPassword(
  forgotPasswordFormData: ForgotPasswordFormInputType
) {
  const user = await prisma.user.findUnique({
    where: { email: forgotPasswordFormData.email },
  });
  if (!user) throw new Error("The user does not exist.");

  // if user exists, send an email with restpassword link
  const jwtUserId = signJwt({ id: user.id });
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/resetPassword/${jwtUserId}`;
  const resetPasswordData = {
    toEmail: user.email!,
    subject: "Reset your password",
    firstName: user.firstName!,
    resetUrl: resetUrl,
  };

  await sendResetEmail(resetPasswordData);
}

type ResetPasswordFunc = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFunc = async (jwtUserId, password) => {
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";

  const userId = payload.id; // id was set in forgotPassword server action
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) return "userNotExist";

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      hashedPassword: await bcrypt.hash(password, 10),
    },
  });
  if (result) return "success";
  else throw new Error("Something went wrong...");

  redirect("/");
};
