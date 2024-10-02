"use client";

import {
  CreateFundingProgrammeFormFormInputType,
  CreateFundingProgrammeFormSchema,
} from "@/app/validationSchemas";
import { createFundingProgrammeSA } from "@/lib/actions/funderActions";
import { fundingAgencyWithProgrammesAgenciesCalls } from "@/prisma/customTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FundingAgency } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const FundingProgrammeForm = () => {
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<CreateFundingProgrammeFormFormInputType>({
    resolver: zodResolver(CreateFundingProgrammeFormSchema),
  });

  const { data: fundingAgencies, isLoading, error } = useFundingAgencies();

  const onSubmitCreateFundingProgramme = async (
    createFundingProgrammeFormData: CreateFundingProgrammeFormFormInputType,
  ) => {
    // console.log(createFundingProgrammeFormData);

    try {
      const result = await createFundingProgrammeSA(
        createFundingProgrammeFormData,
      );

      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);

        // Reset the form after successfull submission
        reset();

        // Invalidate (and refetch) every query in the cache
        // queryClient.invalidateQueries();

        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitCreateFundingProgramme)}
      className="space-y-2"
    >
      <h2 className="text-xl font-bold">Add a new Funding Programme</h2>

      <Input
        {...register("name")}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        type="text"
        label="Funding Programme Name (NWO: Funding Lines)"
        placeholder="Enter Funding Programme Name. E.g., EU-HORIZON, NWO-Talent Development Programme, etc."
      />

      {/* Add an input field for selecting the related funding agency */}
      <Controller
        control={control}
        name="fundingAgencyId"
        render={({ field }) => (
          <Select
            {...field}
            {...register("fundingAgencyId")}
            errorMessage={errors.fundingAgencyId?.message}
            isInvalid={!!errors.fundingAgencyId}
            label="(Related) Funding Agency"
            placeholder="Select the related funding agency"
          >
            {fundingAgencies ? (
              fundingAgencies.map((fundingAgency) => (
                <SelectItem key={fundingAgency.id} value={fundingAgency.id}>
                  {fundingAgency.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem key={""} value={""}>
                None
              </SelectItem>
            )}
          </Select>
        )}
      />

      <div className="flex justify-between">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
        >
          {isSubmitting
            ? "Adding Funding Programme..."
            : "Add Funding Programme"}
        </Button>

        <Button type="button" color="danger" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// This fetcher is created so that I can use fetch() to add a tag for relvalidating
// in the SA;
// https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation
const fetchFundingAgencies = async () => {
  const res = await fetch("/api/fundingAgencies", {
    next: { tags: ["fundingAgencies-api"] },
  });
  const data = await res.json();
  return data;
};

export const useFundingAgencies = () =>
  useQuery<fundingAgencyWithProgrammesAgenciesCalls[]>({
    queryKey: ["fundingAgencies-api"], // can this tag be revalidated in SA?
    // queryFn: () => axios.get("/api/fundingAgencies").then((res) => res.data),
    queryFn: () => fetchFundingAgencies(),
    staleTime: 60 * 1000, //60s
    retry: 3,
    cacheTime: 0, // 0 = no cache
  });

export default FundingProgrammeForm;
