import { GrantStatusBadge } from "@/app/components";
import { Flex, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";
import CustomFiledDetails from "./CustomFiledDetails";
import prisma from "@/prisma/client";
import { GrantWithAllRelatedTypes } from "@/prisma/customTypes";

interface Props {
  grant: GrantWithAllRelatedTypes;
}

type SectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

type ChoiceClusterProps = {
  selectLabel: string;
  selectValue: string | number | null;
  textLabel: string;
  textValue: string | number | null;
};

const formatDate = (value: Date | null | undefined) =>
  value ? value.toISOString().split("T")[0] : null;

function DetailSection({
  eyebrow,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section className="detail-section">
      <div className="detail-section-header">
        <Text className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
          {eyebrow}
        </Text>
        <h2 className="detail-section-title">{title}</h2>
        <p className="detail-section-copy">{description}</p>
      </div>
      <div className="detail-section-body">{children}</div>
    </section>
  );
}

function ChoiceCluster({
  selectLabel,
  selectValue,
  textLabel,
  textValue,
}: ChoiceClusterProps) {
  return (
    <div className="field-cluster md:col-span-2 xl:col-span-2">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <CustomFiledDetails subheading={selectLabel} fieldInfo={selectValue} />
        <span className="or-divider">or</span>
        <CustomFiledDetails subheading={textLabel} fieldInfo={textValue} />
      </div>
    </div>
  );
}

const GrantDetails = async ({ grant }: Props) => {
  const user = grant.assignedToUserId
    ? await prisma.user.findUnique({
        where: { id: grant.assignedToUserId },
      })
    : null;

  return (
    <Flex direction="column" gap="5" className="max-w-full">
      <section className="detail-section overflow-hidden">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-5 md:px-6">
          <Text className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
            Grant Workspace
          </Text>
          <Heading className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
            View Grant
          </Heading>
          <Text className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
            This view mirrors the editing structure so the record can be reviewed
            in the same sequence it is maintained across the dashboard.
          </Text>
          <Flex gap="3" mt="4" wrap="wrap" align="center">
            <GrantStatusBadge status={grant.status} />
            <Text className="text-sm text-[var(--color-text-secondary)]">
              Last updated {grant.updatedAt.toDateString()}
            </Text>
          </Flex>
        </div>
      </section>

      <DetailSection
        eyebrow="Overview"
        title="Core Grant Identity"
        description="Start with the primary title, shorthand, and a plain-language description that gives context before any operational detail."
      >
        <CustomFiledDetails subheading="Title *" fieldInfo={grant.title} />
        <CustomFiledDetails subheading="Acronym *" fieldInfo={grant.acronym} />
        <div className="detail-span-full">
          <CustomFiledDetails
            subheading="Description *"
            fieldInfo={grant.description}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Applicant"
        title="People And Approval Context"
        description="Document who is applying, how they are positioned in the group, and which internal approvals already exist."
      >
        <div className="field-cluster detail-span-full">
          <div className="grid gap-4 md:grid-cols-3">
            <CustomFiledDetails
              subheading="Applicant's LastName + FirstName - Text input *"
              fieldInfo={grant.applicantFullName}
            />
            <CustomFiledDetails
              subheading="Applicant's Designation (Group member type) *"
              fieldInfo={grant.groupMemberType}
            />
            <CustomFiledDetails
              subheading="Applicant's Groupleader *"
              fieldInfo={user?.lastName ?? null}
            />
          </div>
        </div>

        <div>
          <CustomFiledDetails
            subheading="Applicant's Grant Application Role *"
            fieldInfo={grant.applicantRole}
          />
        </div>

        <div className="field-cluster detail-span-full space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Internal Approval
          </p>
          <CustomFiledDetails
            subheading="Is Budget approved by the Project Controller?"
            fieldInfo={grant.isBudgetApproved ? "Yes" : "No"}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Budget"
        title="Financial Inputs"
        description="Keep the amount fields concise and easy to scan, with disabled legacy inputs visually de-emphasized."
      >
        <div className="field-cluster detail-span-full">
          <div className="grid gap-4 md:grid-cols-2">
            <CustomFiledDetails
              subheading="<Disabled, to be removed> Budget Total of the grant application"
              fieldInfo={grant.budgetTotal}
            />
            <CustomFiledDetails
              subheading="Budget Assigned to the applicant (or UMCG)"
              fieldInfo={grant.budgetAssignedToPI}
            />
          </div>
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Funding"
        title="Funding Taxonomy"
        description="Structured selections and manual fallback text stay side by side so each grant can be recorded even when the taxonomy is incomplete."
      >
        <ChoiceCluster
          selectLabel="Funding Agency - Select"
          selectValue={grant.relatedFundingAgency?.name ?? "Not specified"}
          textLabel="Funding Agency - Text input"
          textValue={grant.fundingAgency}
        />
        <ChoiceCluster
          selectLabel="Funding Programme - Select"
          selectValue={grant.relatedFundingProgramme?.name ?? "Not specified"}
          textLabel="Funding Programme - Text input"
          textValue={grant.fundingProgramme}
        />
        <ChoiceCluster
          selectLabel="Funding Action - Select"
          selectValue={grant.relatedFundingAction?.name ?? "Not specified"}
          textLabel="Funding Action - Text input"
          textValue={grant.fundingAction}
        />
        <ChoiceCluster
          selectLabel="Funding Call - Select"
          selectValue={grant.relatedFundingCall?.name ?? "Not specified"}
          textLabel="Funding Call - Text input"
          textValue={grant.fundingCall}
        />
        <div className="detail-span-full">
          <CustomFiledDetails
            subheading="URL of the Funding Call"
            fieldInfo={grant.urlFundingCall}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Timeline"
        title="Dates And Status"
        description="Submission milestones and lifecycle status are grouped together to support later filtering and operational follow-up."
      >
        <div className="field-cluster detail-span-full">
          <div className="grid gap-4 md:grid-cols-3">
            <CustomFiledDetails
              subheading="Submission Date"
              fieldInfo={formatDate(grant.submissionDate)}
            />
            <CustomFiledDetails
              subheading="Deadline Date"
              fieldInfo={formatDate(grant.deadline)}
            />
            <CustomFiledDetails
              subheading="Decision Date"
              fieldInfo={formatDate(grant.decisionDate)}
            />
          </div>
        </div>

        <div>
          <CustomFiledDetails
            subheading="Application Status *"
            fieldInfo={grant.status ?? null}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Delivery"
        title="Post-Award Delivery"
        description="Capture project timing, internal project identifiers, and post-award documentation in one calmer closing section."
      >
        <div className="field-cluster detail-span-full">
          <div className="grid gap-4 md:grid-cols-2">
            <CustomFiledDetails
              subheading="Project Start Date (post award)"
              fieldInfo={formatDate(grant.projectStartDate)}
            />
            <CustomFiledDetails
              subheading="Project End Date (post award)"
              fieldInfo={formatDate(grant.projectEndDate)}
            />
          </div>
        </div>

        <div>
          <CustomFiledDetails
            subheading="Project number (UMCG, post award)"
            fieldInfo={grant.projectNumber}
          />
        </div>

        <div className="field-cluster detail-span-full space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Documentation
          </p>
          <CustomFiledDetails
            subheading="Is DMP created, reviewed by the DCC-UMCG, and shared with the Project Manager?"
            fieldInfo={grant.isDMPSubmitted ? "Yes" : "No"}
          />
        </div>

        <div className="detail-span-full">
          <CustomFiledDetails
            subheading="<Disabled, to be removed> Additional notes"
            fieldInfo={grant.notes}
          />
        </div>
      </DetailSection>
    </Flex>
  );
};

export default GrantDetails;
