"use client";

import { createFundingAgencySA } from "@/lib/actions/funderActions";
import { updateFundingAgencySA } from "@/lib/actions/updateFunderActions";
import {
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
} from "@/lib/validationSchemas";
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
import {
  enumLocalityType,
  enumSectorType,
  FundingAgency,
} from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  fAgency?: FundingAgency;
}

const FundingAgencyForm = ({ fAgency }: Props) => {
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

  const createUpdateFundingAgencyOnSubmit = async (
    fundingAgencyFormData: CreateFundingAgencyFormInputType,
  ) => {
    try {
      const result = fAgency
        ? await updateFundingAgencySA(fAgency.id, fundingAgencyFormData)
        : await createFundingAgencySA(fundingAgencyFormData);

      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);
      }

      reset();
      router.push("/dashboard/funders");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong...");
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(createUpdateFundingAgencyOnSubmit)}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Add a new Funding Agency</h2>

      <div>
        <Label className="mb-2 block">Funding Agency Name</Label>
        <Input
          {...register("name")}
          type="text"
          placeholder="Enter funding agency name. E.g., EU/EC, NL/NWO, DE/DFG, UK/UKRI, US/NIH, etc."
          defaultValue={fAgency?.name}
        />
        <FieldError className="mt-1" message={errors.name?.message} />
      </div>

      <Controller
        control={control}
        name="localityType"
        defaultValue={fAgency?.localityType ?? undefined}
        render={({ field }) => (
          <div>
            <Label className="mb-2 block">Locality Type</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select locality type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(enumLocalityType).map((localityType) => (
                  <SelectItem key={localityType} value={localityType}>
                    {localityType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError
              className="mt-1"
              message={errors.localityType?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="sectorType"
        defaultValue={fAgency?.sectorType ?? undefined}
        render={({ field }) => (
          <div>
            <Label className="mb-2 block">Sector Type</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sector type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(enumSectorType).map((sectorType) => (
                  <SelectItem key={sectorType} value={sectorType}>
                    {sectorType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError
              className="mt-1"
              message={errors.sectorType?.message}
            />
          </div>
        )}
      />

      <div>
        <Label className="mb-2 block">Funding Agency URL</Label>
        <Input
          {...register("url")}
          type="text"
          placeholder="Enter funding agency url"
          defaultValue={fAgency?.url ?? ""}
        />
        <FieldError className="mt-1" message={errors.url?.message} />
      </div>

      <div className="flex justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {fAgency ? "Update Funding Agency" : "Create New Funding Agency"}
        </Button>

        <Button type="button" variant="destructive" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default FundingAgencyForm;
