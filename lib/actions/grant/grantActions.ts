"use server";

import { checkAuth } from "@/lib/server-utils";
import { getErrorMessage } from "@/lib/utils";
import { grantFormSchema } from "@/lib/validationSchemas";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// createGrant() SA ============================================
// Using this SA in GrantForm.tsx component;
export async function createGrant(grantData: unknown) {
  // Authneticate the user
  const session = await checkAuth();

  // Validate the input data
  const validatedGrant = grantFormSchema.safeParse(grantData);
  if (!validatedGrant.success) {
    return {
      success: false,
      message:
        "Invalid data. Failed to create grant." +
        "\n" +
        getErrorMessage(validatedGrant.error),
    };
  }
  // console.log("validatedGrant: ", validatedGrant.data);

  // Destructure the validated data
  //   GrantCreateInput has 31 fields
  // (whereas Grant model has 38 - and grantFormSchema has 27 fields)

  // const data_grant: Prisma.GrantCreateInput = {
  //   ...validatedGrant.data,
  // };

  // DB mutation: create grant
  try {
    await prisma.grant.create({
      data: {
        ...validatedGrant.data,
        createdByUserId: session.user.id,
        // OR:
        //   createdByUser: {
        //     connect: {
        //       id: session.user.id,
        //     },
        //   },
      },
    });

    return {
      success: true,
      message: "Success. Created grant.",
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      message:
        "Database error. Failed to create grant." +
        "\n" +
        getErrorMessage(error),
    };
  }

  // TODO: come back after implementing data fetching in the layout file;
  // Revalidate the path to force the client to re-fetch the data
  // revalidatePath("/dashboard", "layout");
}
