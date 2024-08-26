"use server";

import {
  CreateFundingActionFormInputType,
  CreateFundingActionFormSchema,
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
  CreateFundingCallFormInputType,
  CreateFundingCallFormSchema,
  CreateFundingProgrammeFormFormInputType,
  CreateFundingProgrammeFormSchema,
} from "@/app/validationSchemas";
import { getErrorMessage } from "../utils";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

// Create FundingAgency server action
export async function createFundingAgencySA(
  createFundingAgencyFormData: CreateFundingAgencyFormInputType,
) {
  // validate form data
  const validatedFields = CreateFundingAgencyFormSchema.safeParse(
    createFundingAgencyFormData,
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to create funding agency." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, localityType, sectorType, url } = validatedFields.data;

  //   If valid, make sure that we don't have a funding agency w/ same name
  //   Here findUnique() cannot be used b/c its db model doesn't have a
  //   unique field other than id;
  const fundingAgencyEntry = await prisma.fundingAgency.findFirst({
    where: { name: name },
  });
  if (fundingAgencyEntry) {
    return {
      success: false,
      message:
        "Funding agency already exists. Failed to create funding agency.",
    };
  }

  //   If funding agency doesn't exists, create a funding agency
  try {
    const newFundingAgency = await prisma.fundingAgency.create({
      data: {
        name: name,
        localityType: localityType,
        sectorType: sectorType,
        url: url,
      },
    });

    // Revalidate the list of funding agencies
    revalidateTag("fundingAgencies-api");

    if (newFundingAgency) {
      return {
        success: true,
        message: "Funding agency created successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to create funding agency" +
        "\n" +
        getErrorMessage(error),
    };
  }
}

// ##########################
// Create funding programme server action
export async function createFundingProgrammeSA(
  createFundingProgrammeFormData: CreateFundingProgrammeFormFormInputType,
) {
  // Validate form data
  const validatedFields = CreateFundingProgrammeFormSchema.safeParse(
    createFundingProgrammeFormData,
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to create funding programme." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, fundingAgencyId } = validatedFields.data;

  // If valid, make sure that we don't have a funding programme w/ same name
  // Here findUnique() cannot be used b/c its db model doesn't have a
  // unique field other than id;
  const fundingProgrammeEntry = await prisma.fundingProgramme.findFirst({
    where: { name: name },
  });
  if (fundingProgrammeEntry) {
    return {
      success: false,
      message:
        "Funding programme already exists. Failed to create funding programme.",
    };
  }

  //   If funding programme doesn't exists, create a funding programme
  try {
    const newFundingProgramme = await prisma.fundingProgramme.create({
      data: {
        name: name,
        fundingAgencyId: fundingAgencyId,
      },
    });

    // Revalidate the list of funding programmes
    revalidateTag("fundingAgencies-api");

    if (newFundingProgramme) {
      return {
        success: true,
        message: "Funding programme created successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to create funding programme" +
        "\n" +
        getErrorMessage(error),
    };
  }
}

// ##########################
// Create funding Action server action
export async function createFundingActionSA(
  createFundingActionFormData: CreateFundingActionFormInputType,
) {
  // Validate form data
  const validatedFields = CreateFundingActionFormSchema.safeParse(
    createFundingActionFormData,
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to create funding action." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, fundingProgrammeId } = validatedFields.data;

  // If valid, make sure that we don't have a Funding Action w/ same name
  // Here findUnique() cannot be used b/c its db model doesn't have a
  // unique field other than id;
  const fundingActionEntry = await prisma.fundingAction.findFirst({
    where: { name: name },
  });
  if (fundingActionEntry) {
    return {
      success: false,
      message:
        "Funding Action already exists. Failed to create Funding Action.",
    };
  }

  //   If funding Action doesn't exists, create a new funding Action
  try {
    const newFundingAction = await prisma.fundingAction.create({
      data: {
        name: name,
        fundingProgrammeId: fundingProgrammeId,
      },
    });

    // Revalidate the list of funding programmes
    revalidateTag("fundingProgrammes-api");

    if (newFundingAction) {
      return {
        success: true,
        message: "Funding Action created successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to create Funding Action" +
        "\n" +
        getErrorMessage(error),
    };
  }
}

// ##########################
// Create funding Call server action
export async function createFundingCallSA(
  createFundingCallFormData: CreateFundingCallFormInputType,
) {
  // Validate form data
  const validatedFields = CreateFundingCallFormSchema.safeParse(
    createFundingCallFormData,
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to create Funding Call." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, fundingActionId, url } = validatedFields.data;

  // If valid, make sure that we don't have a funding call w/ same name
  // Here findUnique() cannot be used b/c its db model doesn't have a
  // unique field other than id;
  const fundingCallEntry = await prisma.fundingCall.findFirst({
    where: { name: name },
  });
  if (fundingCallEntry) {
    return {
      success: false,
      message: "Funding Call already exists. Failed to create Funding Call.",
    };
  }

  //   If funding Call doesn't exists, create a new funding Call
  try {
    const newFundingCall = await prisma.fundingCall.create({
      data: {
        name: name,
        url: url,
        fundingActionId: fundingActionId,
      },
    });

    // Revalidate the list of funding Actions
    revalidateTag("fundingActions-api");

    if (newFundingCall) {
      return {
        success: true,
        message: "Funding Call created successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to create Funding Call" +
        "\n" +
        getErrorMessage(error),
    };
  }
}
