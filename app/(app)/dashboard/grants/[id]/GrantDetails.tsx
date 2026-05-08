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
      {children}
    </section>
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
            Grant Overview
          </Text>
          <Heading className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
            {grant.title}
          </Heading>
          <Text className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
            A single place to review the operational profile of this application,
            from applicant context and funding structure through to award timing
            and delivery notes.
          </Text>
          <Flex gap="3" mt="4" wrap="wrap" align="center">
            <GrantStatusBadge status={grant.status} />
            <Text className="text-sm text-[var(--color-text-secondary)]">
              Last updated {grant.updatedAt.toDateString()}
            </Text>
          </Flex>
        </div>
        <div className="detail-grid md:grid-cols-2">
          <CustomFiledDetails subheading="Acronym" fieldInfo={grant.acronym} />
          <CustomFiledDetails
            subheading="Description"
            fieldInfo={grant.description}
          />
        </div>
      </section>

      <DetailSection
        eyebrow="Applicant"
        title="Ownership And Application Context"
        description="The people, roles, and internal approval details that frame this submission."
      >
        <div className="detail-grid">
          <CustomFiledDetails
            subheading="Applicant's Full Name"
            fieldInfo={grant.applicantFullName}
          />
          <CustomFiledDetails
            subheading="Applicant's Designation"
            fieldInfo={grant.groupMemberType}
          />
          <CustomFiledDetails
            subheading="Applicant's Groupleader"
            fieldInfo={user?.lastName ?? null}
          />
          <CustomFiledDetails
            subheading="Grant Application Role"
            fieldInfo={grant.applicantRole}
          />
          <CustomFiledDetails
            subheading="Budget Approved By Project Controller"
            fieldInfo={grant.isBudgetApproved ? "Yes" : "No"}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Funding"
        title="Funding Structure"
        description="Selected taxonomy values and fallback free-text entries are shown together so the record remains readable even when a canonical source was not used."
      >
        <div className="detail-grid">
          <CustomFiledDetails
            subheading="Funding Agency (Select)"
            fieldInfo={grant.relatedFundingAgency?.name ?? "Not specified"}
          />
          <CustomFiledDetails
            subheading="Funding Agency (Text Input)"
            fieldInfo={grant.fundingAgency}
          />
          <CustomFiledDetails
            subheading="Funding Programme (Select)"
            fieldInfo={grant.relatedFundingProgramme?.name ?? "Not specified"}
          />
          <CustomFiledDetails
            subheading="Funding Programme (Text Input)"
            fieldInfo={grant.fundingProgramme}
          />
          <CustomFiledDetails
            subheading="Funding Action (Select)"
            fieldInfo={grant.relatedFundingAction?.name ?? "Not specified"}
          />
          <CustomFiledDetails
            subheading="Funding Action (Text Input)"
            fieldInfo={grant.fundingAction}
          />
          <CustomFiledDetails
            subheading="Funding Call (Select)"
            fieldInfo={grant.relatedFundingCall?.name ?? "Not specified"}
          />
          <CustomFiledDetails
            subheading="Funding Call (Text Input)"
            fieldInfo={grant.fundingCall}
          />
          <CustomFiledDetails
            subheading="Funding Call URL"
            fieldInfo={grant.urlFundingCall}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Budget And Timing"
        title="Financial And Timeline Data"
        description="Key amounts and milestone dates for submission, decisioning, and project delivery."
      >
        <div className="detail-grid">
          <CustomFiledDetails
            subheading="Budget Total"
            fieldInfo={grant.budgetTotal}
          />
          <CustomFiledDetails
            subheading="Budget Assigned To Applicant"
            fieldInfo={grant.budgetAssignedToPI}
          />
          <CustomFiledDetails
            subheading="Submission Date"
            fieldInfo={formatDate(grant.submissionDate)}
          />
          <CustomFiledDetails
            subheading="Deadline"
            fieldInfo={formatDate(grant.deadline)}
          />
          <CustomFiledDetails
            subheading="Decision Date"
            fieldInfo={formatDate(grant.decisionDate)}
          />
          <CustomFiledDetails
            subheading="Grant Status"
            fieldInfo={grant.status ?? null}
          />
          <CustomFiledDetails
            subheading="Project Start Date"
            fieldInfo={formatDate(grant.projectStartDate)}
          />
          <CustomFiledDetails
            subheading="Project End Date"
            fieldInfo={formatDate(grant.projectEndDate)}
          />
          <CustomFiledDetails
            subheading="Project Number"
            fieldInfo={grant.projectNumber}
          />
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="Delivery"
        title="Operational Notes"
        description="Post-award documentation state and any additional context recorded for internal follow-up."
      >
        <div className="detail-grid md:grid-cols-2">
          <CustomFiledDetails
            subheading="DMP Created And Shared"
            fieldInfo={grant.isDMPSubmitted ? "Yes" : "No"}
          />
          <CustomFiledDetails subheading="Notes" fieldInfo={grant.notes} />
        </div>
      </DetailSection>
    </Flex>
  );
};

export default GrantDetails;
