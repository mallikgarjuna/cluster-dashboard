"use client";

import { createFundingProgrammeSA } from "@/lib/actions/funderActions";
import { updateFundingProgrammeSA } from "@/lib/actions/updateFunderActions";
import {
  CreateFundingProgrammeFormFormInputType,
  CreateFundingProgrammeFormSchema,
} from "@/lib/validationSchemas";
import { FundingAgencyWithProgrammesActionsCallsAndGrants } from "@/prisma/customTypes";
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
import { FundingProgramme } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  fProgramme?: FundingProgramme;
}

const FundingProgrammeForm = ({ fProgramme }: Props) => {
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

  const { data: fundingAgencies } = useFundingAgencies();

  const onSubmitCreateUpdateFundingProgramme = async (
    fundingProgrammeFormData: CreateFundingProgrammeFormFormInputType,
  ) => {
    try {
      const result = fProgramme
        ? await updateFundingProgrammeSA(
            fProgramme.id,
            fundingProgrammeFormData,
          )
        : await createFundingProgrammeSA(fundingProgrammeFormData);

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
      onSubmit={handleSubmit(onSubmitCreateUpdateFundingProgramme)}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Add a new Funding Programme</h2>

      <div>
        <Label className="mb-2 block">
          Funding Programme Name (NWO: Funding Lines)
        </Label>
        <Input
          {...register("name")}
          type="text"
          placeholder="Enter Funding Programme Name. E.g., EU-HORIZON, NWO-Talent Development Programme, etc."
          defaultValue={fProgramme?.name}
        />
        <FieldError className="mt-1" message={errors.name?.message} />
      </div>

      <Controller
        control={control}
        name="fundingAgencyId"
        defaultValue={fProgramme?.fundingAgencyId ?? undefined}
        render={({ field }) => (
          <div>
            <Label className="mb-2 block">(Related) Funding Agency</Label>
            {fundingAgencies ? (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the related funding agency" />
                </SelectTrigger>
                <SelectContent>
                  {fundingAgencies.map((fundingAgency) => (
                    <SelectItem key={fundingAgency.id} value={fundingAgency.id}>
                      {fundingAgency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>Loading funding agencies...</p>
            )}
            <FieldError
              className="mt-1"
              message={errors.fundingAgencyId?.message}
            />
          </div>
        )}
      />

      <div className="flex justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {fProgramme
            ? "Update Funding Programme"
            : "Create New Funding Programme"}
        </Button>

        <Button type="button" variant="destructive" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const fetchFundingAgencies = async () => {
  const res = await fetch("/api/fundingAgencies", {
    next: { tags: ["fundingAgencies-api"] },
  });
  const data = await res.json();
  return data;
};

export const useFundingAgencies = () =>
  useQuery<FundingAgencyWithProgrammesActionsCallsAndGrants[]>({
    queryKey: ["fundingAgencies-api"],
    queryFn: () => fetchFundingAgencies(),
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

export default FundingProgrammeForm;
