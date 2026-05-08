"use client";

import { createFundingActionSA } from "@/lib/actions/funderActions";
import { updateFundingActionSA } from "@/lib/actions/updateFunderActions";
import {
  CreateFundingActionFormInputType,
  CreateFundingActionFormSchema,
} from "@/lib/validationSchemas";
import { FundingProgrammeWithActionsCalls } from "@/prisma/customTypes";
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
import { FundingAction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  fAction?: FundingAction;
}

const FundingActionForm = ({ fAction }: Props) => {
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

  const { data: fundingProgrammes } = useFundingProgrammes();

  const onSubmitCreateUpdateFundingActionForm = async (
    fundingActionFormData: CreateFundingActionFormInputType,
  ) => {
    try {
      const result = fAction
        ? await updateFundingActionSA(fAction.id, fundingActionFormData)
        : await createFundingActionSA(fundingActionFormData);

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
      onSubmit={handleSubmit(onSubmitCreateUpdateFundingActionForm)}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Add a new Funding Action</h2>

      <div>
        <Label className="mb-2 block">
          Funding Action name (NWO: Funding Instrument/Programme)
        </Label>
        <Input
          {...register("name")}
          type="text"
          placeholder="Enter Funding Action name. E.g., ERC/MSCA/etc., Veni/Vidi/Vici/etc."
          defaultValue={fAction?.name}
        />
        <FieldError className="mt-1" message={errors.name?.message} />
      </div>

      <Controller
        control={control}
        name="fundingProgrammeId"
        defaultValue={fAction?.fundingProgrammeId ?? undefined}
        render={({ field }) => (
          <div>
            <Label className="mb-2 block">(Related) Funding Programme</Label>
            {fundingProgrammes ? (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the related funding programme" />
                </SelectTrigger>
                <SelectContent>
                  {fundingProgrammes.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>Loading funding programs...</p>
            )}
            <FieldError
              className="mt-1"
              message={errors.fundingProgrammeId?.message}
            />
          </div>
        )}
      />

      <div className="flex justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {fAction ? "Update Funding Action" : "Create New Funding Action"}
        </Button>

        <Button type="button" variant="destructive" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const fetchFundingProgrammes = async () => {
  const res = await fetch("/api/fundingProgrammes", {
    next: { tags: ["fundingProgrammes-api"] },
  });
  const data = await res.json();
  return data;
};

export const useFundingProgrammes = () =>
  useQuery<FundingProgrammeWithActionsCalls[]>({
    queryKey: ["fundingProgrammes-api"],
    queryFn: () => fetchFundingProgrammes(),
    staleTime: 60 * 1000,
    retry: 3,
    cacheTime: 0,
  });

export default FundingActionForm;
