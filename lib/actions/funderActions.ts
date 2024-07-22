"use server";

import {
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
} from "@/app/validationSchemas";
import { getErrorMessage } from "../utils";
import prisma from "@/prisma/client";

// Create FundingAgency server action
export async function createFundingAgencySA(
  createFundingAgencyFormData: CreateFundingAgencyFormInputType
) {
  // validate form data
  const validatedFields = CreateFundingAgencyFormSchema.safeParse(
    createFundingAgencyFormData
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
