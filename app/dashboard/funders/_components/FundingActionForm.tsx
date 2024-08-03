"use client";

import {
  CreateFundingActionFormInputType,
  CreateFundingActionFormSchema,
} from "@/app/validationSchemas";
import { createFundingActionSA } from "@/lib/actions/funderActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FundingProgramme } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const FundingActionForm = () => {
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<CreateFundingActionFormInputType>({
    resolver: zodResolver(CreateFundingActionFormSchema),
  });

  const { data: fundingProgrammes, isLoading, error } = useFundingProgrammes();

  const onSubmitCreateFundingActionForm = async (
    createFundingActionFormData: CreateFundingActionFormInputType,
  ) => {
    // console.log(createFundingActionFormData);

    try {
      const result = await createFundingActionSA(createFundingActionFormData);

      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);

        // Reset the form after successfull submission
        reset();

        // Invalidate (and refetch) every query in the cache
        // queryClient.invalidateQueries();

        router.refresh();
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong..." + "\n" + error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitCreateFundingActionForm)}
      className="space-y-2"
    >
      <h2 className="text-xl font-bold">Add a new Funding Action</h2>

      <Input
        {...register("name")}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        type="text"
        label="Funding Action name (NWO: Funding Instrument/Programme)"
        placeholder="Enter Funding Action name. E.g., ERC/MSCA/etc., Veni/Vidi/Vici/etc."
      />

      {/* Add an input field for selecting the related funding programme */}
      <Controller
        control={control}
        name="fundingProgrammeId"
        render={({ field }) => (
          <Select
            {...field}
            {...register("fundingProgrammeId")}
            errorMessage={errors.fundingProgrammeId?.message}
            isInvalid={!!errors.fundingProgrammeId}
            label="(Related) Funding Programme"
            placeholder="Select the related funding programme"
          >
            {fundingProgrammes ? (
              fundingProgrammes.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
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
            ? "Adding Funding Action...  "
            : "Add Funding Action   "}
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
const fetchFundingProgrammes = async () => {
  const res = await fetch("/api/fundingProgrammes", {
    next: { tags: ["fundingProgrammes-api"] },
  });
  const data = await res.json();
  return data;
};

const useFundingProgrammes = () =>
  useQuery<FundingProgramme[]>({
    queryKey: ["fundingProgrammes-api"],
    queryFn: () => fetchFundingProgrammes(),
    // staleTime: 60 * 1000, //60s
    // retry: 3,
    cacheTime: 0,
  });

export default FundingActionForm;
