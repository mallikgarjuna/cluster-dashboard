"use client";
import { Spinner } from "@/app/components";
import { GrantFormDataType, grantFormSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Grant, StatusGrant, User, enumApplicantRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { fetchAllUsers } from "@/lib/actions/user/queries";
import { useQuery } from "@tanstack/react-query";

interface Props {
  grant?: Grant;
}

const GrantForm = ({ grant }: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GrantFormDataType>({
    resolver: zodResolver(grantFormSchema),
  });

  const submitGrantForm: SubmitHandler<GrantFormDataType> = async (
    grantFormData,
  ) => {
    console.log(grantFormData);
    try {
      if (grant) {
        await axios.patch(`/api/grants/${grant.id}`, grantFormData);
      } else {
        await axios.post("/api/grants", grantFormData);
      }
      toast.success("The grant was saved successfully!");
      reset();
      router.push("/dashboard/grants/list");
      router.refresh();
      // console.log(grantFormData);
    } catch (error) {
      toast.error("Something went wrong...");
      console.log(error);
    }
  };

  const { data: users, error, isLoading } = useUsers();

  const statuses = Object.values(StatusGrant);

  const applicantRoles = Object.values(enumApplicantRole);

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit(submitGrantForm)} className="space-y-2">
        <div className="text-3xl font-bold">
          {!!grant ? "Edit Grant" : "Create New Grant"}
        </div>

        <Input
          {...register("title")}
          errorMessage={errors.title?.message}
          isInvalid={!!errors.title}
          type="text"
          label="Title"
          placeholder="Title of the grant"
          defaultValue={grant?.title}
        />

        <Input
          {...register("acronym")}
          errorMessage={errors.acronym?.message}
          isInvalid={!!errors.acronym}
          type="text"
          label="Acronym"
          placeholder="Acronym of the grant"
          defaultValue={grant?.acronym || ""}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact
              {...field}
              placeholder="Description of grant"
              options={{
                maxHeight: "100px",
                autofocus: true,
              }}
            />
          )}
          defaultValue={grant?.description}
        />
        {!!errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}

        <Input
          {...register("budgetTotal", { valueAsNumber: true })}
          errorMessage={errors.budgetTotal?.message}
          isInvalid={!!errors.budgetTotal}
          type="number"
          label="Budget Total"
          placeholder="Total budget of the grant"
          // defaultValue is uncontrolled (if not below, may need to use Controlled comp;)
          defaultValue={grant?.budgetTotal?.toString() || "0"}
          // defaultValue={grant?.budgetTotal || 0}
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

        <Input
          {...register("fundingAgency")}
          errorMessage={errors.fundingAgency?.message}
          isInvalid={!!errors.fundingAgency}
          type="text"
          label="Funding Agency"
          placeholder="Funding Agency for the grant. E.g., Horizon EU or NWO"
          defaultValue={grant?.fundingAgency || ""}
        />

        <Input
          {...register("fundingProgramme")}
          errorMessage={errors.fundingProgramme?.message}
          isInvalid={!!errors.fundingProgramme}
          type="text"
          label="Funding Programme"
          placeholder="Funding Programme from the funding agency. E.g., ERC or TalentProgramme"
          defaultValue={grant?.fundingProgramme || ""}
        />

        <Input
          {...register("fundingCall")}
          errorMessage={errors.fundingCall?.message}
          isInvalid={!!errors.fundingCall}
          type="text"
          label="Funding Call"
          placeholder="Funding Call from the funding agency. E.g., ERC-Starting-2024 or Veni(Science)-2024"
          defaultValue={grant?.fundingCall || ""}
        />

        <Input
          {...register("submissionDate")}
          errorMessage={errors.submissionDate?.message}
          isInvalid={!!errors.submissionDate}
          type="date"
          label="Submission Date"
          // placeholder="Submission date of the grant"
          defaultValue={grant?.submissionDate?.toISOString().substring(0, 10)}
        />

        <Input
          {...register("deadline")}
          errorMessage={errors.deadline?.message}
          isInvalid={!!errors.deadline}
          type="date"
          label="Deadline Date"
          // placeholder="Submission date of the grant"
          defaultValue={grant?.deadline?.toISOString().substring(0, 10)}
        />

        <Input
          {...register("decisionDate")}
          errorMessage={errors.decisionDate?.message}
          isInvalid={!!errors.decisionDate}
          type="date"
          label="Decision Date"
          // placeholder="Submission date of the grant"
          defaultValue={grant?.decisionDate?.toISOString().substring(0, 10)}
        />

        <Input
          {...register("projectStartDate")}
          errorMessage={errors.projectStartDate?.message}
          isInvalid={!!errors.projectStartDate}
          type="date"
          label="Project Start Date (post award)"
          placeholder="Project start date of the grant"
          defaultValue={grant?.projectStartDate?.toISOString().substring(0, 10)}
        />

        <Input
          {...register("projectEndDate")}
          errorMessage={errors.projectEndDate?.message}
          isInvalid={!!errors.projectEndDate}
          type="date"
          label="Project End Date (post award)"
          placeholder="End date of the project"
          defaultValue={grant?.projectEndDate?.toISOString().substring(0, 10)}
        />

        <Input
          {...register("projectNumber", {
            setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
          })}
          errorMessage={errors.projectNumber?.message}
          isInvalid={!!errors.projectNumber}
          type="number"
          label="Project number (UMCG)"
          placeholder="6 digit project number from project controller"
          defaultValue={grant?.projectNumber?.toString() || ""} //default is null if not provided
        />

        <Controller
          control={control}
          name="assignedToUserId"
          render={({ field }) => {
            const selectedKeys = grant?.assignedToUserId
              ? [grant.assignedToUserId]
              : [];
            return (
              <Select
                {...field}
                label="Applicant Groupleader"
                placeholder="Select groupleader"
                className="max-w-xs"
                {...register("assignedToUserId")}
                errorMessage={errors.assignedToUserId?.message}
                isInvalid={!!errors.assignedToUserId}
                defaultSelectedKeys={selectedKeys}
              >
                {users?.map((user) => (
                  <SelectItem
                    key={user?.id}
                    value={user?.id}
                    textValue={user?.lastName ?? ""}
                  >
                    {user?.lastName}
                  </SelectItem>
                )) ?? []}
              </Select>
            );
          }}
        />

        <Controller
          control={control}
          name="applicantRole"
          render={({ field }) => {
            const selectedKeys = grant?.applicantRole
              ? [grant.applicantRole]
              : [];
            return (
              <Select
                label="Applicant Role"
                placeholder="Select Applecant Role"
                className="max-w-xs"
                {...register("applicantRole")}
                errorMessage={errors.applicantRole?.message}
                isInvalid={!!errors.applicantRole}
                defaultSelectedKeys={selectedKeys}
              >
                {applicantRoles?.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    textValue={role.toString()}
                  >
                    {role}
                  </SelectItem>
                )) ?? []}
              </Select>
            );
          }}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => {
            const selectedKeys = grant?.status ? [grant.status] : [];
            return (
              <Select
                label="Applicantion Status"
                placeholder="Select status"
                className="max-w-xs"
                {...register("status")}
                errorMessage={errors.status?.message}
                isInvalid={!!errors.status}
                defaultSelectedKeys={selectedKeys}
              >
                {statuses?.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    textValue={status.toString()}
                  >
                    {status}
                  </SelectItem>
                )) ?? []}
              </Select>
            );
          }}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact
              {...field}
              placeholder="Additional notes"
              options={{
                maxHeight: "100px",
                autofocus: true,
              }}
            />
          )}
          defaultValue={grant?.notes || ""}
        />
        {!!errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
        )}

        <div className="flex justify-between">
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {grant ? "Update Grant" : "Create New Grant"}
            {isSubmitting && <Spinner />}
          </Button>
          <Button type="button" color="danger" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["usersInGrantForm"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

export default GrantForm;
