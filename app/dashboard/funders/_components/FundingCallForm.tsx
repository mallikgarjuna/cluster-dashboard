"use client";

import {
  CreateFundingCallFormInputType,
  CreateFundingCallFormSchema,
} from "@/app/validationSchemas";
import { createFundingCallSA } from "@/lib/actions/funderActions";
import { updateFundingCallSA } from "@/lib/actions/updateFunderActions";
import { FundingActionWithCalls } from "@/prisma/customTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FundingCall } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import React from "react";

interface Props {
  fCall?: FundingCall;
}

const FundingCallForm = ({ fCall }: Props) => {
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<CreateFundingCallFormInputType>({
    resolver: zodResolver(CreateFundingCallFormSchema),
  });

  const { data: fundingActions, isLoading, error } = useFundingActions();

  const onSubmitCreateUpdateFundingCallForm = async (
    fundingCallFormData: CreateFundingCallFormInputType,
  ) => {
    // console.log(fundingCallFormData);

    try {
      const result = fCall
        ? await updateFundingCallSA(fCall.id, fundingCallFormData)
        : await createFundingCallSA(fundingCallFormData);

      //
      //
      //
      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);

        // Reset the form after successfull submission
        reset();

        // Invalidate (and refetch) every query in the cache
        // queryClient.invalidateQueries();

        router.refresh();
        router.push("/dashboard/funders");
      }
    } catch (error) {
      toast.error("Something went wrong..." + "\n" + error);
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitCreateUpdateFundingCallForm)}
      className="space-y-2"
    >
      <h2 className="text-xl font-bold">Add a new Funding Call</h2>

      <Input
        {...register("name")}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        type="text"
        label="Funding Call ID (NWO: Funding Round ID)"
        placeholder="Enter Funding Call ID. E.g., MSCA-DN-2024/etc., Veni-ZonMw-2024/etc."
        defaultValue={fCall?.name}
      />

      <Input
        {...register("url")}
        errorMessage={errors.url?.message}
        isInvalid={!!errors.url}
        type="text"
        label="URL of the Funding Call ID"
        placeholder="Enter a valid URL"
        defaultValue={fCall?.url ?? ""}
      />

      {/* Add an input field for selecting the related funding programme */}
      <Controller
        control={control}
        name="fundingActionId"
        defaultValue={fCall?.fundingActionId ?? undefined}
        render={({ field }) => (
          <>
            {fundingActions ? (
              <Select
                {...field}
                {...register("fundingActionId")}
                errorMessage={errors.fundingActionId?.message}
                isInvalid={!!errors.fundingActionId}
                label="(Related) Funding Action"
                placeholder="Select the related funding action"
                // defaultSelectedKeys={
                //   fCall?.fundingActionId ? [fCall.fundingActionId] : []
                // }
              >
                {fundingActions ? (
                  fundingActions.map((fundingAction) => (
                    <SelectItem key={fundingAction.id} value={fundingAction.id}>
                      {fundingAction.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key={""} value={""}>
                    None
                  </SelectItem>
                )}
              </Select>
            ) : (
              <p>Loading funding actions...</p>
            )}{" "}
          </>
        )}
      />

      <div className="flex justify-between">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
        >
          {fCall ? "Update Funding Call" : "Create New Funding Call"}
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
const fetchFundingActions = async () => {
  const res = await fetch("/api/fundingActions", {
    next: { tags: ["fundingActions-api"] },
  });
  const data = await res.json();
  return data;
};

export const useFundingActions = () =>
  useQuery<FundingActionWithCalls[]>({
    queryKey: ["fundingActions-api"],
    queryFn: () => fetchFundingActions(),
    staleTime: 60 * 1000, //60s
    retry: 3,
    cacheTime: 0,
  });

// This useFundingCalls() is created to use it in GrantForm.tsx select dropdown
// There was no place better to create it than here.
const fetchFundingCalls = async () => {
  const res = await fetch("/api/fundingCalls", {
    next: { tags: ["fundingCalls-api"] },
  });
  const data = await res.json();
  return data;
};

export const useFundingCalls = () =>
  useQuery<FundingCall[]>({
    queryKey: ["fundingCalls-api"],
    queryFn: () => fetchFundingCalls(),
    staleTime: 60 * 1000, //60s
    retry: 3,
    cacheTime: 0,
  });

export default FundingCallForm;
