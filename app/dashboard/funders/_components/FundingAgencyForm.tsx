"use client";

import {
  CreateFundingAgencyFormInputType,
  CreateFundingAgencyFormSchema,
} from "@/lib/validationSchemas";
import { createFundingAgencySA } from "@/lib/actions/funderActions";
import { updateFundingAgencySA } from "@/lib/actions/updateFunderActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  enumLocalityType,
  enumSectorType,
  FundingAgency,
} from "@prisma/client";
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
    // console.log("createUpdateFundingAgencyOnSubmit: ", fundingAgencyFormData);

    try {
      const result = fAgency
        ? await updateFundingAgencySA(fAgency.id, fundingAgencyFormData)
        : await createFundingAgencySA(fundingAgencyFormData);
      if (!result?.success) {
        toast.error(result?.message + " ");
      } else {
        toast.success(result.message);
      }

      // Reset the form after successful submission
      reset();

      // Invalidate (and refetch) every query in the cache
      // queryClient.invalidateQueries();

      // Route to the newly created funding agency
      // router.push(`/dashboard/funders/${result.data.id}`);
      // router.push("/dashboard/funders");
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
        defaultValue={fAgency?.name}
      />

      <Controller
        control={control}
        name="localityType"
        defaultValue={fAgency?.localityType ?? undefined}
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
        defaultValue={fAgency?.sectorType ?? undefined}
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
        defaultValue={fAgency?.url ?? ""}
      />

      <div className="flex justify-between">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting} // is a spinner
          color="primary"
        >
          {fAgency ? "Update Funding Agency" : "Create New Funding Agency"}
          {/* {isSubmitting && <Spinner />} */}
        </Button>

        <Button type="button" color="danger" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default FundingAgencyForm;
