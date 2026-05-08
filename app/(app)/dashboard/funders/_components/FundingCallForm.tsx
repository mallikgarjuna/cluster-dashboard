"use client";

import { createFundingCallSA } from "@/lib/actions/funderActions";
import { updateFundingCallSA } from "@/lib/actions/updateFunderActions";
import {
  CreateFundingCallFormInputType,
  CreateFundingCallFormSchema,
} from "@/lib/validationSchemas";
import { FundingActionWithCalls } from "@/prisma/customTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FundingCall } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

  const { data: fundingActions } = useFundingActions();

  const onSubmitCreateUpdateFundingCallForm = async (
    fundingCallFormData: CreateFundingCallFormInputType,
  ) => {
    try {
      const result = fCall
        ? await updateFundingCallSA(fCall.id, fundingCallFormData)
        : await createFundingCallSA(fundingCallFormData);

      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);
        reset();
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
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Add a new Funding Call</h2>

      <div>
        <Label className="mb-2 block">
          Funding Call ID (NWO: Funding Round ID)
        </Label>
        <Input
          {...register("name")}
          type="text"
          placeholder="Enter Funding Call ID. E.g., MSCA-DN-2024/etc., Veni-ZonMw-2024/etc."
          defaultValue={fCall?.name}
        />
        <FieldError className="mt-1" message={errors.name?.message} />
      </div>

      <div>
        <Label className="mb-2 block">URL of the Funding Call ID</Label>
        <Input
          {...register("url")}
          type="text"
          placeholder="Enter a valid URL"
          defaultValue={fCall?.url ?? ""}
        />
        <FieldError className="mt-1" message={errors.url?.message} />
      </div>

      <Controller
        control={control}
        name="fundingActionId"
        defaultValue={fCall?.fundingActionId ?? undefined}
        render={({ field }) => (
          <div>
            <Label className="mb-2 block">(Related) Funding Action</Label>
            {fundingActions ? (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the related funding action" />
                </SelectTrigger>
                <SelectContent>
                  {fundingActions.map((fundingAction) => (
                    <SelectItem key={fundingAction.id} value={fundingAction.id}>
                      {fundingAction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>Loading funding actions...</p>
            )}
            <FieldError
              className="mt-1"
              message={errors.fundingActionId?.message}
            />
          </div>
        )}
      />

      <div className="flex justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {fCall ? "Update Funding Call" : "Create New Funding Call"}
        </Button>

        <Button type="button" variant="destructive" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

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
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

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
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

export default FundingCallForm;
