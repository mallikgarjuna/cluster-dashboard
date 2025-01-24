"use server";
import {
  CreateUserFormInputType,
  CreateUserFormSchema,
  ForgotPasswordFormInputType,
  ForgotPasswordFormSchema,
  LoginFormInputType,
  LoginFormSchema,
  SignupFormInputType,
  SignupFormSchema,
} from "@/lib/validationSchemas";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { signJwt, verifyJwt } from "../jwt";
import { getErrorMessage } from "../utils";
import { sendActivationEmail, sendResetEmail } from "./mailActions";
import { signIn, signOut } from "../auth-no-edge";
import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";

// =========================================================
// register user action (not using it; use createUserByAdmin SA instead);
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

  const activationUrl = `${process.env.AUTH_URL}/auth/activation/${jwtUserId}`;
  const activationData = {
    toEmail: newUser.email!,
    subject: "Activate your account",
    firstName: newUser.firstName!,
    activationUrl: activationUrl,
  };
  //   await axios.post(`${process.env.AUTH_URL}/api/sendEmail`, activationData);
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

// Create user by admin ======================================
// Using this SA in CreateUserForm component;
export async function createUserByAdmin(createUserFormData: unknown) {
  // validate the input data
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

  // destructure the validated data
  const { firstName, lastName, email, password, role, departmentId } =
    validatedFields.data;
  const name = `${firstName} ${lastName}`;
  const hashedPassword = await bcrypt.hash(password, 10);

  // db mutation: create user
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Email already exists",
        };
      }
    }
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

  const activationUrl = `${process.env.AUTH_URL}/auth/activation/${jwtUserId}`;
  const activationData = {
    toEmail: "m.gurram@umcg.nl", //Admin email hardcoded; //newUser.email!;
    subject: "Activate account: Created new user for " + newUser.email,
    firstName: "Admin",
    activationUrl: activationUrl,
  };
  const activationResult = await sendActivationEmail(activationData);
  if (!activationResult.success) {
    return {
      success: false,
      message:
        "Failed to send activation email. But user is created successfully by Admin." +
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

// Using this SA in LoginForm;====================================
export async function loginUser(formData: unknown) {
  // Check if the `formData` is a valid `FormData` object
  // b/c only `FormData` object can be passed to `signIn()` function
  if (!(formData instanceof FormData)) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            success: false,
            message: "Invalid credentials",
          };
        }
        default: {
          return {
            success: false,
            message: "Error. Could not sign in.",
          };
        }
      }
    }

    // return {
    //   message: "Could not sign in",
    // };
    throw error; // nextjs redirects throws an error, so we need to rethrow the error;
  }

  // redirect("/profile"); // b/c /dashboard is taking too long to load
}

// Using this SA in LogOutButton component ========================
export async function logOutUser() {
  // In Next-Auth v5, you can call signOut() on server-side (here in SA)
  await signOut({ redirectTo: "/" });
}

// Activate user server action (called in auth/activation/[jwt]/page.tsx)
// Using this SA in ActivationPage SC ===============================
type ActivateUserFunction = (
  jwtUserId: string,
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

// forgotPassword() SA ============================================
// Used in ForgotPasswordForm.tsx
export async function forgotPassword(forgotPasswordFormData: unknown) {
  // validate the input data
  const validatedFields = ForgotPasswordFormSchema.safeParse(
    forgotPasswordFormData,
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Invalid data." +
        "/n" +
        getErrorMessage(validatedFields.error),
    };
  }

  // destructure/parse the validated data
  const { email } = validatedFields.data;

  // db operation: check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    // throw new Error("The user does not exist.");
    return {
      success: false,
      message: "The user does not exist.",
    };
  }

  // if user exists, send an email with restpassword link
  const jwtUserId = signJwt({ id: user.id });
  const resetUrl = `${process.env.AUTH_URL}/auth/resetPassword/${jwtUserId}`;
  const resetPasswordData = {
    toEmail: user.email!,
    subject: "Reset your password",
    firstName: user.firstName!,
    resetUrl: resetUrl,
  };

  const result = await sendResetEmail(resetPasswordData);
  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }
  return {
    success: true,
    message:
      "Reset password link is sent to your email." + "\n" + result.message,
  };
}

// resetPassword() SA ============================================
// Used in ResetPasswordForm.tsx
type ResetPasswordFunc = (
  jwtUserId: string,
  password: string,
) => Promise<{ success: boolean; message: string }>;
// ) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFunc = async (jwtUserId, password) => {
  // validate the input data
  const payload = verifyJwt(jwtUserId);
  if (!payload) {
    // return "userNotExist"
    return {
      success: false,
      message: "Invalid user. Please try again.",
    };
  }

  // destructure/parse the validated data
  const userId = payload.id; // id was set in forgotPassword server action

  // db operation: check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    // return "userNotExist";
    return {
      success: false,
      message: "User does not exist.",
    };
  }

  // if user exists, update the password
  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        hashedPassword: await bcrypt.hash(password, 10),
      },
    });
    if (result) {
      // return "success";
      return {
        success: true,
        message: "Password reset successfully.",
      };
    }
  } catch (error) {
    // else throw new Error("Something went wrong...");
    return {
      success: false,
      message: "Something went wrong... Failed to reset password.",
    };
  }

  redirect("/");
};

// Exported in this action file:
// registerUser, createUserByAdmin, loginUser, activateUser, forgotPassword, resetPassword
//
