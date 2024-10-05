"use server";

import {
  CreateFundingActionFormInputType,
  CreateFundingActionFormSchema,
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
  CreateFundingProgrammeFormFormInputType,
  CreateFundingProgrammeFormSchema,
} from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getErrorMessage } from "../utils";
import { revalidateTag } from "next/cache";

// Update funding agency server action
async function updateFundingAgencySA(
  id: string,
  formData: CreateFundingAgencyFormInputType,
) {
  //   Validating form data
  const validatedFields = CreateFundingAgencyFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to update funding agency." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, localityType, sectorType, url } = validatedFields.data;

  // Validating funding agency
  //   Make sure that client is updating a valid funding agency
  const fAgencyEntry = await prisma.fundingAgency.findUnique({
    where: { id: id },
  });
  if (!fAgencyEntry) {
    return {
      success: false,
      message: "Funding agency not found or invalid.",
    };
  }

  //   If funding agency exists, update it
  try {
    const updatedFundingAgency = await prisma.fundingAgency.update({
      where: { id: fAgencyEntry.id },
      data: {
        name,
        localityType,
        sectorType,
        url,
      },
    });

    // Revalidate the list of funding agencies
    revalidateTag("fundingAgencies-api");

    if (updatedFundingAgency) {
      return {
        success: true,
        message:
          "Funding agency updated successfully" +
          "\n" +
          updatedFundingAgency?.name,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to update funding agency" +
        "\n" +
        getErrorMessage(error),
    };
  }
}

// Update funding programme server action
async function updateFundingProgrammeSA(
  id: string,
  formData: CreateFundingProgrammeFormFormInputType,
) {
  //  Validating form data
  const validatedFields = CreateFundingProgrammeFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to update funding programme." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, fundingAgencyId } = validatedFields.data;

  // Validating funding programme
  // Make sure that client is updating a valid funding programme
  const fProgrammeEntry = await prisma.fundingProgramme.findUnique({
    where: { id: id },
  });
  if (!fProgrammeEntry) {
    return {
      success: false,
      message: "Funding programme not found or invalid.",
    };
  }

  // If funding programme exists, update it
  try {
    const updatedFundingProgramme = await prisma.fundingProgramme.update({
      where: { id: fProgrammeEntry.id },
      data: {
        name,
        fundingAgencyId,
      },
    });

    // Revalidate the list of funding programmes
    revalidateTag("fundingAgencies-api");
    revalidateTag("fundingProgrammes-api");

    if (updatedFundingProgramme) {
      return {
        success: true,
        message:
          "Funding programme updated successfully" +
          "\n" +
          updatedFundingProgramme.name,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to update funding programme" +
        "\n" +
        getErrorMessage(error),
    };
  }
}

// Update funding action server action
async function updateFundingActionSA(
  id: string,
  formData: CreateFundingActionFormInputType,
) {
  // Validating form data
  const validatedFields = CreateFundingActionFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Missing fields. Failed to update funding action." +
        "\n" +
        getErrorMessage(validatedFields.error),
    };
  }
  const { name, fundingProgrammeId } = validatedFields.data;

  // Validating funding action
  // Make sure that client is updating a valid funding action
  const fActionEntry = await prisma.fundingAction.findUnique({
    where: { id: id },
  });
  if (!fActionEntry) {
    return {
      success: false,
      message: "Funding action not found or invalid.",
    };
  }

  // If funding action exists, update it
  try {
    const updatedFundingAction = await prisma.fundingAction.update({
      where: { id: fActionEntry.id },
      data: {
        name,
        fundingProgrammeId,
      },
    });

    // Revalidate the list of funding actions
    revalidateTag("fundingAgencies-api");
    revalidateTag("fundingProgrammes-api");
    revalidateTag("fundingActions-api");

    if (updatedFundingAction) {
      return {
        success: true,
        message:
          "Funding action updated successfully" +
          "\n" +
          updatedFundingAction.name,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Database error. Failed to update funding action" +
        "\n" +
        getErrorMessage(error),
    };
  }
}

// Single export statement to export all functions (variables, etc., if any)
export {
  updateFundingAgencySA,
  updateFundingProgrammeSA,
  updateFundingActionSA,
};
