"use client";

import {
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
} from "@/app/validationSchemas";
import { createFundingAgencySA } from "@/lib/actions/funderActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { enumLocalityType, enumSectorType } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const FundingAgencyForm = () => {
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<CreateFundingAgencyFormInputType>({
    resolver: zodResolver(CreateFundingAgencyFormSchema),
  });

  const createFundingAgencyOnSubmit = async (
    createFundingAgencyFormData: CreateFundingAgencyFormInputType,
  ) => {
    // console.log("createFundingAgencyOnSubmit: ", createFundingAgencyFormData);

    try {
      const result = await createFundingAgencySA(createFundingAgencyFormData);
      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);

        // Reset the form after successful submission
        reset();

        // Invalidate (and refetch) every query in the cache
        // queryClient.invalidateQueries();

        // Route to the newly created funding agency
        // router.push(`/dashboard/funders/${result.data.id}`);
        // router.push("/dashboard/funders");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong...");
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(createFundingAgencyOnSubmit)}
      className="space-y-2"
    >
      <h2 className="text-xl font-bold">Add a new Funding Agency</h2>

      <Input
        {...register("name")}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        type="text"
        label="Funding Agency Name"
        placeholder="Enter funding agency name. E.g., EU/EC, NL/NWO, DE/DFG, UK/UKRI, US/NIH, etc."
      />

      <Controller
        control={control}
        name="localityType"
        render={({ field }) => (
          <Select
            {...register("localityType")}
            errorMessage={errors.localityType?.message}
            isInvalid={!!errors.localityType}
            label="Locality Type"
            placeholder="Select locality type"
          >
            {Object.values(enumLocalityType).map((localityType) => (
              <SelectItem key={localityType} value={localityType}>
                {localityType}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="sectorType"
        render={({ field }) => (
          <Select
            {...register("sectorType")}
            errorMessage={errors.sectorType?.message}
            isInvalid={!!errors.sectorType}
            label="Sector Type"
            placeholder="Select sector type"
          >
            {Object.values(enumSectorType).map((sectorType) => (
              <SelectItem key={sectorType} value={sectorType}>
                {sectorType}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Input
        {...register("url")}
        errorMessage={errors.url?.message}
        isInvalid={!!errors.url}
        type="text"
        label="Funding Agency URL"
        placeholder="Enter funding agency url"
      />

      <div className="flex justify-between">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Adding Funding Agency..." : "Add Funding Agency"}
        </Button>

        <Button type="button" color="danger" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default FundingAgencyForm;
