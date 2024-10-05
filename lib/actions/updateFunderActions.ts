"use server";

import {
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
} from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getErrorMessage } from "../utils";

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

// Single export statement to export all functions (variables, etc., if any)
export { updateFundingAgencySA };
