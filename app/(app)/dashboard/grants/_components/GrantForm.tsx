"use client";
import { Spinner } from "@/app/components";
import { GrantFormDataType, grantFormSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  FundingAction,
  FundingCall,
  FundingProgramme,
  Grant,
  StatusGrant,
  User,
  enumApplicantRole,
  enumGroupMemberType,
} from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { fetchAllUsers } from "@/lib/actions/user/queries";
import { useQuery } from "@tanstack/react-query";
import { useFundingAgencies } from "../../funders/_components/FundingProgrammeForm";
import {
  FundingActionWithCalls,
  FundingProgrammeWithActionsCalls,
  GrantWithAllRelatedTypes,
} from "@/prisma/customTypes";
import { useFundingProgrammes } from "../../funders/_components/FundingActionForm";
import {
  useFundingActions,
  useFundingCalls,
} from "../../funders/_components/FundingCallForm";
import { useEffect, useState } from "react";

interface Props {
  // grant?: Grant;
  grant?: GrantWithAllRelatedTypes;
}

const GrantForm = ({ grant }: Props) => {
  console.log("GrantForm rendered");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<GrantFormDataType>({
    resolver: zodResolver(grantFormSchema),
  });

  const { data: users, error, isLoading } = useUsers();

  const [fundingProgrammes, setFundingProgrammes] = useState<
    FundingProgrammeWithActionsCalls[]
  >([]);
  const [fundingActions, setFundingActions] = useState<
    FundingActionWithCalls[]
  >([]);
  const [fundingCalls, setFundingCalls] = useState<FundingCall[]>([]);

  // Watch the funders Ids
  const selectedFundingAgencyId = watch("fundingAgencyId");
  const selectedFundingProgrammeId = watch("fundingProgrammeId");
  const selectedFundingActionId = watch("fundingActionId");

  const { data: fetchedFundingAgencies } = useFundingAgencies();
  const { data: fetchedFundingProgrammes } = useFundingProgrammes();
  const { data: fetchedFundingActions } = useFundingActions();
  const { data: fetchedFundingCalls } = useFundingCalls();

  // Effect to update fundingProgrammes when a fundingAgency is selected
  useEffect(() => {
    const selectedFundingAgency = fetchedFundingAgencies?.find(
      (fAgency) => fAgency.id === selectedFundingAgencyId,
    );
    setValue("fundingProgrammeId", undefined); //Reset when agency is selected
    setFundingProgrammes(selectedFundingAgency?.fundingProgrammes || []);
  }, [selectedFundingAgencyId, fetchedFundingAgencies, setValue]);

  // Effect to update fundingActions when a fundingProgramme is selected
  useEffect(() => {
    const selectedFundingProgrmme = fundingProgrammes.find(
      (fp) => fp.id === selectedFundingProgrammeId,
    );
    setValue("fundingActionId", undefined); //Reset when programme is selected
    setFundingActions(selectedFundingProgrmme?.fundingActions || []);
  }, [selectedFundingProgrammeId, fundingProgrammes, setValue]);

  // Effect to update fundingCalls when a fundingAction is selected
  useEffect(() => {
    const selectedFundingAction = fundingActions.find(
      (fa) => fa.id === selectedFundingActionId,
    );
    setValue("fundingCallId", undefined); //Reset when action is selected
    setFundingCalls(selectedFundingAction?.fundingCalls || []);
  }, [selectedFundingActionId, fundingActions, setValue]);

  const statuses = Object.values(StatusGrant);

  const applicantRoles = Object.values(enumApplicantRole);

  const groupMemberTypes = Object.values(enumGroupMemberType);

  const submitGrantForm: SubmitHandler<GrantFormDataType> = async (
    grantFormData,
  ) => {
    // console.log(grantFormData);
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

  return (
    <div className="max-w-full">
      <form onSubmit={handleSubmit(submitGrantForm)} className="space-y-2">
        <div className="text-3xl font-bold">
          {!!grant ? "Edit Grant" : "Create New Grant"}
        </div>
        <Input
          {...register("title")}
          errorMessage={errors.title?.message}
          isInvalid={!!errors.title}
          type="text"
          label="Title *"
          placeholder="Title of the grant"
          defaultValue={grant?.title}
          classNames={{
            input: [
              "placeholder:text-default-700/50 dark:placeholder:text-default-400",
            ],
          }}
        />
        <Input
          {...register("acronym")}
          errorMessage={errors.acronym?.message}
          isInvalid={!!errors.acronym}
          type="text"
          label="Acronym *"
          placeholder="Maximum 20 characters (If none, add two keywords from the title)"
          defaultValue={grant?.acronym || ""}
          classNames={{
            input: [
              "placeholder:text-default-700/50 dark:placeholder:text-default-400",
            ],
          }}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact
              {...field}
              placeholder="Description of grant *"
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
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          <Input
            {...register("applicantFullName")}
            errorMessage={errors.applicantFullName?.message}
            isInvalid={!!errors.applicantFullName}
            type="text"
            label="Applicant's LastName + FirstName - Text input *"
            placeholder="(If not a PI): Applicant's LastName + FirstName"
            defaultValue={grant?.applicantFullName}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />

          <Controller
            control={control}
            name="groupMemberType"
            defaultValue={grant?.groupMemberType ?? undefined}
            render={({ field }) => {
              return (
                <Select
                  label="Applicant's Designation (Group member type) *"
                  placeholder="Select Applicant's Designation"
                  // className="max-w-xs"
                  {...register("groupMemberType")}
                  errorMessage={errors.groupMemberType?.message}
                  isInvalid={!!errors.groupMemberType}
                  classNames={{
                    value: grant?.groupMemberType
                      ? "text-black"
                      : "text-gray-400",
                  }}
                >
                  {groupMemberTypes?.map((memberType) => (
                    <SelectItem
                      key={memberType}
                      value={memberType}
                      textValue={memberType.toString()}
                    >
                      {memberType}
                    </SelectItem>
                  )) ?? []}
                </Select>
              );
            }}
          />

          <Controller
            control={control}
            name="assignedToUserId"
            defaultValue={grant?.assignedToUserId ?? undefined}
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  label="Applicant's Groupleader *"
                  placeholder="Select groupleader"
                  // className="max-w-xs"
                  {...register("assignedToUserId")}
                  errorMessage={errors.assignedToUserId?.message}
                  isInvalid={!!errors.assignedToUserId}
                  defaultSelectedKeys={
                    grant?.assignedToUserId ? [grant.assignedToUserId] : []
                  }
                  onChange={(event) => {
                    const newValue = event.target.value;
                    field.onChange(newValue);
                    if (
                      newValue &&
                      getValues("applicantFullName") === "" &&
                      getValues("groupMemberType") === "PI"
                    ) {
                      const selectedUser = users?.find(
                        (user) => user.id === newValue,
                      );
                      setValue(
                        "applicantFullName",
                        selectedUser?.lastName || "",
                      );
                    }

                    // console.log(
                    //   "applicantFullName: ",
                    //   getValues("applicantFullName"),
                    // );
                    // console.log(
                    //   "groupMemberType: ",
                    //   getValues("groupMemberType"),
                    // );
                    // console.log("event.target.value: ", event.target.value);
                  }}
                  classNames={{
                    value: grant?.assignedToUserId
                      ? "text-black"
                      : "text-gray-400",
                  }}
                  scrollShadowProps={{ isEnabled: false }}
                  showScrollIndicators={true}
                  listboxProps={{
                    className: "max-h-[300px] overflow-y-auto ",
                  }}
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
        </div>
        <Controller
          control={control}
          name="applicantRole"
          defaultValue={grant?.applicantRole ?? undefined}
          render={({ field }) => {
            // const selectedKeys = grant?.applicantRole
            //   ? [grant.applicantRole]
            //   : [];
            return (
              <Select
                label="Applicant's Grant Application Role *"
                placeholder="Select Applecant Role"
                // className="max-w-xs"
                {...register("applicantRole")}
                errorMessage={errors.applicantRole?.message}
                isInvalid={!!errors.applicantRole}
                // defaultSelectedKeys={selectedKeys}
                classNames={{
                  value: grant?.applicantRole ? "text-black" : "text-gray-400",
                }}
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
          name="isBudgetApproved"
          defaultValue={grant?.isBudgetApproved ?? false}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              isSelected={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              value={String(field.value)}
            >
              Is Budget approved by the Project Controller?
            </Checkbox>
          )}
        />
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          <Input
            disabled={true}
            {...register("budgetTotal", { valueAsNumber: true })}
            errorMessage={errors.budgetTotal?.message}
            isInvalid={!!errors.budgetTotal}
            type="number"
            label="<Disabled, to be removed> Budget Total of the grant application"
            placeholder="Total budget of the grant"
            // defaultValue is uncontrolled (if not below, may need to use Controlled comp;)
            defaultValue={grant?.budgetTotal?.toString() || "0"}
            // defaultValue={grant?.budgetTotal || 0}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />

          <Input
            {...register("budgetAssignedToPI", { valueAsNumber: true })}
            errorMessage={errors.budgetAssignedToPI?.message}
            isInvalid={!!errors.budgetAssignedToPI}
            type="number"
            label="Budget Assigned to the applicant (or UMCG)"
            placeholder="Budget Assigned to the applicant (or UMCG)"
            // defaultValue is uncontrolled (if not below, may need to use Controlled comp;)
            defaultValue={grant?.budgetAssignedToPI?.toString() || "0"}
            // defaultValue={grant?.budgetTotal || 0}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
            }}
          />
        </div>
        {/* Related Funding Agency */}
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          {/* Add an input field for selecting the related funding agency */}
          <Controller
            control={control}
            name="fundingAgencyId"
            defaultValue={grant?.fundingAgencyId ?? undefined}
            render={({ field }) => (
              <Select
                {...field}
                {...register("fundingAgencyId")}
                errorMessage={errors.fundingAgencyId?.message}
                isInvalid={!!errors.fundingAgencyId}
                label="Funding Agency - Select"
                placeholder="Select the related funding agency"
                defaultSelectedKeys={
                  grant?.fundingAgencyId ? [grant.fundingAgencyId] : []
                }
                // className="bg-gray-600"
                // listboxProps={{
                //   itemClasses: {
                //     base: "bg-gray-600",
                //   },
                // }}
                classNames={{
                  value: grant?.fundingAgencyId
                    ? "text-black"
                    : "text-gray-400",
                }}
              >
                {fetchedFundingAgencies ? (
                  fetchedFundingAgencies.map((fundingAgency) => (
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

          <span className="self-center">or</span>

          <Input
            {...register("fundingAgency")}
            errorMessage={errors.fundingAgency?.message}
            isInvalid={!!errors.fundingAgency}
            type="text"
            label="Funding Agency - Text input"
            placeholder="E.g., EU/EC, NL/NWO, USA/NSF-NIH, DE/DFG, etc."
            defaultValue={grant?.fundingAgency || ""}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />
        </div>
        {/* Related Funding Programme */}
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          {/* Add an input field for selecting the related funding agency */}
          <Controller
            control={control}
            name="fundingProgrammeId"
            defaultValue={grant?.fundingProgrammeId ?? undefined}
            render={({ field }) => (
              <Select
                {...field}
                {...register("fundingProgrammeId")}
                errorMessage={errors.fundingProgrammeId?.message}
                isInvalid={!!errors.fundingProgrammeId}
                label="Funding Programme - Select"
                placeholder="Select the related funding programme"
                defaultSelectedKeys={
                  grant?.fundingProgrammeId ? [grant.fundingProgrammeId] : []
                }
                classNames={{
                  value: grant?.fundingProgrammeId
                    ? "text-black"
                    : "text-gray-400",
                }}
              >
                {selectedFundingAgencyId && fundingProgrammes.length ? (
                  fundingProgrammes.map((fundingProgramme) => (
                    <SelectItem
                      key={fundingProgramme.id}
                      value={fundingProgramme.id}
                    >
                      {fundingProgramme.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key={""} value={""}>
                    None (or) Select a funding agency first
                  </SelectItem>
                )}
              </Select>
            )}
          />

          <span className="self-center">or</span>

          <Input
            {...register("fundingProgramme")}
            errorMessage={errors.fundingProgramme?.message}
            isInvalid={!!errors.fundingProgramme}
            type="text"
            label="Funding Programme - Text input"
            placeholder="E.g., HORIZON-EU, Talent-Development-Programme, etc."
            defaultValue={grant?.fundingProgramme || ""}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />
        </div>
        {/* Related Funding Actions */}
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          {/* Add an input field for selecting the related funding agency */}
          <Controller
            control={control}
            name="fundingActionId"
            defaultValue={grant?.fundingActionId ?? undefined}
            render={({ field }) => (
              <Select
                {...field}
                {...register("fundingActionId")}
                errorMessage={errors.fundingActionId?.message}
                isInvalid={!!errors.fundingActionId}
                label="Funding Action - Select"
                placeholder="Select the related funding action"
                defaultSelectedKeys={
                  grant?.fundingActionId ? [grant.fundingActionId] : [] //
                }
                classNames={{
                  value: grant?.fundingActionId
                    ? "text-black"
                    : "text-gray-400",
                }}
              >
                {selectedFundingProgrammeId && fundingActions ? (
                  fundingActions.map((fundingAction) => (
                    <SelectItem key={fundingAction.id} value={fundingAction.id}>
                      {fundingAction.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key={""} value={""}>
                    None (or) Select a funding programme first
                  </SelectItem>
                )}
              </Select>
            )}
          />

          <span className="self-center">or</span>

          <Input
            {...register("fundingAction")}
            errorMessage={errors.fundingAction?.message}
            isInvalid={!!errors.fundingAction}
            type="text"
            label="Funding Action - Text input"
            placeholder="E.g., ERC, Veni, etc."
            defaultValue={grant?.fundingAction || ""}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />
        </div>
        {/* Related Funding Calls */}
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          {/* Add an input field for selecting the related funding call */}
          <Controller
            control={control}
            name="fundingCallId"
            defaultValue={grant?.fundingCallId ?? undefined}
            render={({ field }) => (
              <Select
                {...field}
                {...register("fundingCallId")}
                errorMessage={errors.fundingCallId?.message}
                isInvalid={!!errors.fundingCallId}
                label="Funding Call - Select"
                placeholder="Select the related funding call"
                onChange={(event) => {
                  field.onChange(event.target.value);
                  const selectedFundingCallId = event.target.value;
                  const selectedFundingCall = fundingCalls?.find(
                    (fc) => fc.id === selectedFundingCallId,
                  );
                  if (selectedFundingCall) {
                    setValue("urlFundingCall", selectedFundingCall.url || "");
                  } else {
                    setValue("urlFundingCall", "");
                  }
                }}
                defaultSelectedKeys={
                  grant?.fundingCallId ? [grant.fundingCallId] : [] //
                }
                classNames={{
                  value: grant?.fundingCallId ? "text-black" : "text-gray-400",
                }}
              >
                {selectedFundingActionId && fundingCalls ? (
                  fundingCalls.map((fundingCallItem) => (
                    <SelectItem
                      key={fundingCallItem.id}
                      value={fundingCallItem.id}
                    >
                      {fundingCallItem.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key={""} value={""}>
                    None (or) Select a funding action first
                  </SelectItem>
                )}
              </Select>
            )}
          />

          <span className="self-center">or</span>

          <Input
            {...register("fundingCall")}
            errorMessage={errors.fundingCall?.message}
            isInvalid={!!errors.fundingCall}
            type="text"
            label="Funding Call - Text input"
            placeholder="E.g., ERC-StG-2024, Veni-ZonMw-2024, etc."
            defaultValue={grant?.fundingCall || ""}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />
        </div>
        <Input
          {...register("urlFundingCall")}
          errorMessage={errors.urlFundingCall?.message}
          isInvalid={!!errors.urlFundingCall}
          type="text"
          label="URL of the Funding Call"
          placeholder="E.g., https://ec.europa.eu/info/funding-tenders/topic-details/erc-2024-stg"
          defaultValue={grant?.urlFundingCall || ""}
          classNames={{
            input: [
              "placeholder:text-default-700/50 dark:placeholder:text-default-400",
            ],
          }}
        />
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          <Input
            {...register("submissionDate")}
            errorMessage={errors.submissionDate?.message}
            isInvalid={!!errors.submissionDate}
            type="date"
            label="Submission Date"
            // placeholder="Submission date of the grant"
            defaultValue={grant?.submissionDate?.toISOString().substring(0, 10)}
            // defaultValue={grant?.submissionDate}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />

          <Input
            {...register("deadline")}
            errorMessage={errors.deadline?.message}
            isInvalid={!!errors.deadline}
            type="date"
            label="Deadline Date"
            // placeholder="Submission date of the grant"
            defaultValue={grant?.deadline?.toISOString().substring(0, 10)}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />

          <Input
            {...register("decisionDate")}
            errorMessage={errors.decisionDate?.message}
            isInvalid={!!errors.decisionDate}
            type="date"
            label="Decision Date"
            // placeholder="Submission date of the grant"
            defaultValue={grant?.decisionDate?.toISOString().substring(0, 10)}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />
        </div>
        <Controller
          control={control}
          name="status"
          defaultValue={grant?.status ?? undefined}
          render={({ field }) => {
            // const selectedKeys = grant?.status ? [grant.status] : [];
            return (
              <Select
                label="Applicantion Status *"
                placeholder="Select status"
                className="max-w-xs"
                {...register("status")}
                errorMessage={errors.status?.message}
                isInvalid={!!errors.status}
                // defaultSelectedKeys={selectedKeys}
                classNames={{
                  value: grant?.status ? "text-black" : "text-gray-400",
                }}
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
        <div className="flex gap-2 rounded-md border border-gray-300 py-2">
          <Input
            {...register("projectStartDate")}
            errorMessage={errors.projectStartDate?.message}
            isInvalid={!!errors.projectStartDate}
            type="date"
            label="Project Start Date (post award)"
            placeholder="Project start date of the grant"
            defaultValue={grant?.projectStartDate
              ?.toISOString()
              .substring(0, 10)}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />

          <Input
            {...register("projectEndDate")}
            errorMessage={errors.projectEndDate?.message}
            isInvalid={!!errors.projectEndDate}
            type="date"
            label="Project End Date (post award)"
            placeholder="End date of the project"
            defaultValue={grant?.projectEndDate?.toISOString().substring(0, 10)}
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-default-400",
              ],
            }}
          />
        </div>
        <Input
          {...register("projectNumber", {
            setValueAs: (val) => (val === "" ? null : parseInt(val, 10)),
          })}
          errorMessage={errors.projectNumber?.message}
          isInvalid={!!errors.projectNumber}
          type="number"
          label="Project number (UMCG, post award)"
          placeholder="6 digit project number from project controller"
          defaultValue={grant?.projectNumber?.toString() || ""} //default is null if not provided
          classNames={{
            input: [
              "placeholder:text-default-700/50 dark:placeholder:text-default-400",
            ],
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
        />
        <Controller
          control={control}
          name="isDMPSubmitted"
          defaultValue={grant?.isDMPSubmitted ?? false}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              isSelected={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              value={String(field.value)}
            >
              Is DMP created, reviewed by the DCC-UMCG, and shared with the
              Project Manager?
            </Checkbox>
          )}
        />
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact
              {...field}
              contentEditable={false}
              placeholder="<Disabled, to be removed> Additional notes"
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
