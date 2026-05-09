"use client";

import { createGrant, updateGrant } from "@/lib/actions/grant/grantActions";
import { GrantFormDataType, grantFormSchema } from "@/lib/validationSchemas";
import { GrantWithAllRelatedTypes } from "@/prisma/customTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  FundingCall,
  StatusGrant,
  User,
  enumApplicantRole,
  enumGroupMemberType,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useFundingAgencies } from "../../funders/_components/FundingProgrammeForm";

interface Props {
  grant?: GrantWithAllRelatedTypes;
}

type FieldWrapperProps = {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

type FormSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

function FieldWrapper({
  label,
  error,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
      <FieldError className="mt-1" message={error} />
    </div>
  );
}

function FormSection({
  eyebrow,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="form-section">
      <div className="form-section-header">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      <div className="form-section-grid">{children}</div>
    </section>
  );
}

const GrantForm = ({ grant }: Props) => {
  const router = useRouter();
  const {
    register,
    trigger,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<GrantFormDataType>({
    resolver: zodResolver(grantFormSchema),
    defaultValues: {
      fundingAgencyId: grant?.fundingAgencyId ?? undefined,
      fundingProgrammeId: grant?.fundingProgrammeId ?? undefined,
      fundingActionId: grant?.fundingActionId ?? undefined,
      fundingCallId: grant?.fundingCallId ?? undefined,
      groupMemberType: grant?.groupMemberType ?? undefined,
      assignedToUserId: grant?.assignedToUserId ?? undefined,
      applicantRole: grant?.applicantRole ?? undefined,
      isBudgetApproved: grant?.isBudgetApproved ?? false,
      isDMPSubmitted: grant?.isDMPSubmitted ?? false,
    },
  });

  const { data: users } = useUsers();
  const { data: fetchedFundingAgencies } = useFundingAgencies();

  const selectedFundingAgencyId = watch("fundingAgencyId");
  const selectedFundingProgrammeId = watch("fundingProgrammeId");
  const selectedFundingActionId = watch("fundingActionId");

  const fundingProgrammes =
    fetchedFundingAgencies?.find(
      (fundingAgency) => fundingAgency.id === selectedFundingAgencyId,
    )?.fundingProgrammes || [];
  const fundingActions =
    fundingProgrammes.find(
      (fundingProgramme) => fundingProgramme.id === selectedFundingProgrammeId,
    )?.fundingActions || [];
  const fundingCalls: FundingCall[] =
    fundingActions.find(
      (fundingAction) => fundingAction.id === selectedFundingActionId,
    )?.fundingCalls || [];

  const hasInitializedFundingAgency = useRef(false);
  const hasInitializedFundingProgramme = useRef(false);
  const hasInitializedFundingAction = useRef(false);

  useEffect(() => {
    if (!hasInitializedFundingAgency.current) {
      hasInitializedFundingAgency.current = true;
      return;
    }

    setValue("fundingProgrammeId", undefined);
    setValue("fundingActionId", undefined);
    setValue("fundingCallId", undefined);
  }, [selectedFundingAgencyId, setValue]);

  useEffect(() => {
    if (!hasInitializedFundingProgramme.current) {
      hasInitializedFundingProgramme.current = true;
      return;
    }

    setValue("fundingActionId", undefined);
    setValue("fundingCallId", undefined);
  }, [selectedFundingProgrammeId, setValue]);

  useEffect(() => {
    if (!hasInitializedFundingAction.current) {
      hasInitializedFundingAction.current = true;
      return;
    }

    setValue("fundingCallId", undefined);
  }, [selectedFundingActionId, setValue]);

  const statuses = Object.values(StatusGrant);
  const applicantRoles = Object.values(enumApplicantRole);
  const groupMemberTypes = Object.values(enumGroupMemberType);

  const handleAction = async (_formData: FormData) => {
    const resultTrigger = await trigger();
    if (!resultTrigger) return;

    const grantData = getValues();
    grantData.submissionDate = grantData.submissionDate || undefined;
    grantData.deadline = grantData.deadline || undefined;
    grantData.decisionDate = grantData.decisionDate || undefined;
    grantData.projectStartDate = grantData.projectStartDate || undefined;
    grantData.projectEndDate = grantData.projectEndDate || undefined;

    grantData.fundingAgencyId = grantData.fundingAgencyId || undefined;
    grantData.fundingProgrammeId = grantData.fundingProgrammeId || undefined;
    grantData.fundingActionId = grantData.fundingActionId || undefined;
    grantData.fundingCallId = grantData.fundingCallId || undefined;

    const result = grant
      ? await updateGrant(grant.id, grantData)
      : await createGrant(grantData);

    if (result && !result.success) {
      toast.error(result.message);
    } else if (result) {
      toast.success(result.message);
      reset();
      router.push("/dashboard/grants/list");
    } else {
      toast.error("Unexpected error. Failed to create/update grant.");
    }
  };

  return (
    <div className="max-w-full">
      <form action={handleAction} className="space-y-5">
        <section className="section-panel overflow-hidden">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-5 md:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Grant Workspace
            </p>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-[32px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
                  {grant ? "Edit Grant" : "Create New Grant"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
                  Capture the application clearly and consistently. The form is
                  grouped to match the way grants are reviewed later across the
                  dashboard.
                </p>
              </div>
              <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {grant ? "Editing Existing Record" : "New Submission Record"}
              </div>
            </div>
          </div>
        </section>

        <FormSection
          eyebrow="Overview"
          title="Core Grant Identity"
          description="Start with the primary title, shorthand, and a plain-language description that gives context before any operational detail."
        >
          <FieldWrapper label="Title *" error={errors.title?.message}>
            <Input
              {...register("title")}
              type="text"
              placeholder="Title of the grant"
              defaultValue={grant?.title}
            />
          </FieldWrapper>

          <FieldWrapper label="Acronym *" error={errors.acronym?.message}>
            <Input
              {...register("acronym")}
              type="text"
              placeholder="Maximum 20 characters (If none, add two keywords from the title)"
              defaultValue={grant?.acronym || ""}
            />
          </FieldWrapper>

          <div className="md:col-span-2">
            <Label className="mb-2 block">Description *</Label>
            <div className="markdown-editor-shell">
              <Controller
                name="description"
                control={control}
                defaultValue={grant?.description}
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
              />
            </div>
            <FieldError className="mt-1" message={errors.description?.message} />
          </div>
        </FormSection>

        <FormSection
          eyebrow="Applicant"
          title="People And Approval Context"
          description="Document who is applying, how they are positioned in the group, and which internal approvals already exist."
        >
          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <FieldWrapper
                label="Applicant's LastName + FirstName - Text input *"
                error={errors.applicantFullName?.message}
              >
                <Input
                  {...register("applicantFullName")}
                  type="text"
                  placeholder="(If not a PI): Applicant's LastName + FirstName"
                  defaultValue={grant?.applicantFullName}
                />
              </FieldWrapper>

              <Controller
                control={control}
                name="groupMemberType"
                defaultValue={grant?.groupMemberType ?? undefined}
                render={({ field }) => (
                  <FieldWrapper
                    label="Applicant's Designation (Group member type) *"
                    error={errors.groupMemberType?.message}
                  >
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Applicant's Designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupMemberTypes.map((memberType) => (
                          <SelectItem key={memberType} value={memberType}>
                            {memberType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldWrapper>
                )}
              />

              <Controller
                control={control}
                name="assignedToUserId"
                defaultValue={grant?.assignedToUserId ?? undefined}
                render={({ field }) => (
                  <FieldWrapper
                    label="Applicant's Groupleader *"
                    error={errors.assignedToUserId?.message}
                  >
                    <Select
                      value={field.value}
                      onValueChange={(newValue) => {
                        field.onChange(newValue);
                        if (
                          newValue &&
                          getValues("applicantFullName") === "" &&
                          getValues("groupMemberType") === "PI"
                        ) {
                          const selectedUser = users?.find((user) => user.id === newValue);
                          setValue("applicantFullName", selectedUser?.lastName || "");
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select groupleader" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.lastName}
                          </SelectItem>
                        )) ?? []}
                      </SelectContent>
                    </Select>
                  </FieldWrapper>
                )}
              />
            </div>
          </div>

          <Controller
            control={control}
            name="applicantRole"
            defaultValue={grant?.applicantRole ?? undefined}
            render={({ field }) => (
              <FieldWrapper
                label="Applicant's Grant Application Role *"
                error={errors.applicantRole?.message}
              >
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Select Applicant Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicantRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />

          <Controller
            control={control}
            name="isBudgetApproved"
            defaultValue={grant?.isBudgetApproved ?? false}
            render={({ field }) => (
              <div className="field-cluster space-y-3 md:col-span-2 xl:col-span-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Internal Approval
                </p>
                <label className="flex items-start gap-3 text-sm leading-6 text-[var(--color-text-primary)]">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                  />
                  <span>Is Budget approved by the Project Controller?</span>
                </label>
                <FieldError message={errors.isBudgetApproved?.message} />
              </div>
            )}
          />
        </FormSection>

        <FormSection
          eyebrow="Budget"
          title="Financial Inputs"
          description="Keep the amount fields concise and easy to scan, with disabled legacy inputs visually de-emphasized."
        >
          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldWrapper
                label="<Disabled, to be removed> Budget Total of the grant application"
                error={errors.budgetTotal?.message}
              >
                <Input
                  disabled
                  {...register("budgetTotal", { valueAsNumber: true })}
                  type="number"
                  placeholder="Total budget of the grant"
                  defaultValue={grant?.budgetTotal?.toString() || "0"}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Budget Assigned to the applicant (or UMCG)"
                error={errors.budgetAssignedToPI?.message}
              >
                <Input
                  {...register("budgetAssignedToPI", { valueAsNumber: true })}
                  type="number"
                  placeholder="Budget Assigned to the applicant (or UMCG)"
                  defaultValue={grant?.budgetAssignedToPI?.toString() || "0"}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </FieldWrapper>
            </div>
          </div>
        </FormSection>

        <FormSection
          eyebrow="Funding"
          title="Funding Taxonomy"
          description="Structured selections and manual fallback text stay side by side so each grant can be recorded even when the taxonomy is incomplete."
        >
          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Controller
            control={control}
            name="fundingAgencyId"
            defaultValue={grant?.fundingAgencyId ?? undefined}
            render={({ field }) => (
              <FieldWrapper
                label="Funding Agency - Select"
                error={errors.fundingAgencyId?.message}
              >
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the related funding agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {fetchedFundingAgencies?.map((fundingAgency) => (
                      <SelectItem key={fundingAgency.id} value={fundingAgency.id}>
                        {fundingAgency.name}
                      </SelectItem>
                    )) ?? []}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />

              <span className="or-divider">or</span>

          <FieldWrapper
            label="Funding Agency - Text input"
            error={errors.fundingAgency?.message}
          >
            <Input
              {...register("fundingAgency")}
              type="text"
              placeholder="E.g., EU/EC, NL/NWO, USA/NSF-NIH, DE/DFG, etc."
              defaultValue={grant?.fundingAgency || ""}
            />
          </FieldWrapper>
            </div>
          </div>

          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Controller
            control={control}
            name="fundingProgrammeId"
            defaultValue={grant?.fundingProgrammeId ?? undefined}
            render={({ field }) => (
              <FieldWrapper
                label="Funding Programme - Select"
                error={errors.fundingProgrammeId?.message}
              >
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedFundingAgencyId || fundingProgrammes.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the related funding programme" />
                  </SelectTrigger>
                  <SelectContent>
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
                      <div className="px-2 py-1.5 text-sm text-zinc-500">
                        None (or) Select a funding agency first
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />

              <span className="or-divider">or</span>

          <FieldWrapper
            label="Funding Programme - Text input"
            error={errors.fundingProgramme?.message}
          >
            <Input
              {...register("fundingProgramme")}
              type="text"
              placeholder="E.g., HORIZON-EU, Talent-Development-Programme, etc."
              defaultValue={grant?.fundingProgramme || ""}
            />
          </FieldWrapper>
            </div>
          </div>

          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Controller
            control={control}
            name="fundingActionId"
            defaultValue={grant?.fundingActionId ?? undefined}
            render={({ field }) => (
              <FieldWrapper
                label="Funding Action - Select"
                error={errors.fundingActionId?.message}
              >
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedFundingProgrammeId || fundingActions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the related funding action" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFundingProgrammeId && fundingActions.length ? (
                      fundingActions.map((fundingAction) => (
                        <SelectItem key={fundingAction.id} value={fundingAction.id}>
                          {fundingAction.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-zinc-500">
                        None (or) Select a funding programme first
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />

              <span className="or-divider">or</span>

          <FieldWrapper
            label="Funding Action - Text input"
            error={errors.fundingAction?.message}
          >
            <Input
              {...register("fundingAction")}
              type="text"
              placeholder="E.g., ERC, Veni, etc."
              defaultValue={grant?.fundingAction || ""}
            />
          </FieldWrapper>
            </div>
          </div>

          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Controller
            control={control}
            name="fundingCallId"
            defaultValue={grant?.fundingCallId ?? undefined}
            render={({ field }) => (
              <FieldWrapper
                label="Funding Call - Select"
                error={errors.fundingCallId?.message}
              >
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedFundingCall = fundingCalls.find((fc) => fc.id === value);
                    setValue("urlFundingCall", selectedFundingCall?.url || "");
                  }}
                  defaultValue={field.value}
                  disabled={!selectedFundingActionId || fundingCalls.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the related funding call" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFundingActionId && fundingCalls.length ? (
                      fundingCalls.map((fundingCallItem) => (
                        <SelectItem
                          key={fundingCallItem.id}
                          value={fundingCallItem.id}
                        >
                          {fundingCallItem.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-zinc-500">
                        None (or) Select a funding action first
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </FieldWrapper>
            )}
          />

              <span className="or-divider">or</span>

          <FieldWrapper
            label="Funding Call - Text input"
            error={errors.fundingCall?.message}
          >
            <Input
              {...register("fundingCall")}
              type="text"
              placeholder="E.g., ERC-StG-2024, Veni-ZonMw-2024, etc."
              defaultValue={grant?.fundingCall || ""}
            />
          </FieldWrapper>
            </div>
          </div>

          <FieldWrapper
            label="URL of the Funding Call"
            error={errors.urlFundingCall?.message}
            className="md:col-span-2 xl:col-span-2"
          >
            <Input
              {...register("urlFundingCall")}
              type="text"
              placeholder="E.g., https://ec.europa.eu/info/funding-tenders/topic-details/erc-2024-stg"
              defaultValue={grant?.urlFundingCall || ""}
            />
          </FieldWrapper>
        </FormSection>

        <FormSection
          eyebrow="Timeline"
          title="Dates And Status"
          description="Submission milestones and lifecycle status are grouped together to support later filtering and operational follow-up."
        >
          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
          <FieldWrapper label="Submission Date" error={errors.submissionDate?.message}>
            <Input
              {...register("submissionDate")}
              type="date"
              defaultValue={grant?.submissionDate?.toISOString().substring(0, 10)}
            />
          </FieldWrapper>

          <FieldWrapper label="Deadline Date" error={errors.deadline?.message}>
            <Input
              {...register("deadline")}
              type="date"
              defaultValue={grant?.deadline?.toISOString().substring(0, 10)}
            />
          </FieldWrapper>

          <FieldWrapper label="Decision Date" error={errors.decisionDate?.message}>
            <Input
              {...register("decisionDate")}
              type="date"
              defaultValue={grant?.decisionDate?.toISOString().substring(0, 10)}
            />
          </FieldWrapper>
            </div>
          </div>

          <Controller
            control={control}
          name="status"
          defaultValue={grant?.status ?? undefined}
          render={({ field }) => (
            <FieldWrapper label="Application Status *" error={errors.status?.message}>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </FieldWrapper>
            )}
          />
        </FormSection>

        <FormSection
          eyebrow="Delivery"
          title="Post-Award Delivery"
          description="Capture project timing, internal project identifiers, and post-award documentation in one calmer closing section."
        >
          <div className="field-cluster md:col-span-2 xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
          <FieldWrapper
            label="Project Start Date (post award)"
            error={errors.projectStartDate?.message}
          >
            <Input
              {...register("projectStartDate")}
              type="date"
              placeholder="Project start date of the grant"
              defaultValue={grant?.projectStartDate?.toISOString().substring(0, 10)}
            />
          </FieldWrapper>

          <FieldWrapper
            label="Project End Date (post award)"
            error={errors.projectEndDate?.message}
          >
            <Input
              {...register("projectEndDate")}
              type="date"
              placeholder="End date of the project"
              defaultValue={grant?.projectEndDate?.toISOString().substring(0, 10)}
            />
          </FieldWrapper>
            </div>
          </div>

          <FieldWrapper
            label="Project number (UMCG, post award)"
            error={errors.projectNumber?.message}
          >
            <Input
              {...register("projectNumber", {
                setValueAs: (val) => (val === "" ? null : parseInt(val, 10)),
              })}
              type="number"
              placeholder="6 digit project number from project controller"
              defaultValue={grant?.projectNumber?.toString() || ""}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                }
              }}
            />
          </FieldWrapper>

          <Controller
            control={control}
            name="isDMPSubmitted"
            defaultValue={grant?.isDMPSubmitted ?? false}
            render={({ field }) => (
              <div className="field-cluster space-y-3 md:col-span-2 xl:col-span-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Documentation
                </p>
                <label className="flex items-start gap-3 text-sm leading-6 text-[var(--color-text-primary)]">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                  />
                  <span>
                    Is DMP created, reviewed by the DCC-UMCG, and shared with the
                    Project Manager?
                  </span>
                </label>
                <FieldError message={errors.isDMPSubmitted?.message} />
              </div>
            )}
          />

          <div className="md:col-span-2 xl:col-span-2">
            <Label className="mb-2 block">
              &lt;Disabled, to be removed&gt; Additional notes
            </Label>
            <div className="markdown-editor-shell">
              <Controller
                name="notes"
                control={control}
                defaultValue={grant?.notes || ""}
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
              />
            </div>
            <FieldError className="mt-1" message={errors.notes?.message} />
          </div>
        </FormSection>

        <div className="section-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
            Save the record when the grant details are complete. You can return
            to the grants list without making additional changes.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {grant ? "Update Grant" : "Create New Grant"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["usersInGrantForm"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

export default GrantForm;
