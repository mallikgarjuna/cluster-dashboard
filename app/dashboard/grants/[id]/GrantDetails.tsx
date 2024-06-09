import { GrantStatusBadge } from "@/app/components";
import { Grant } from "@prisma/client";
import { Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import CustomFiledDetails from "./CustomFiledDetails";
import prisma from "@/prisma/client";

interface Props {
  grant: Grant;
}

const GrantDetails = async ({ grant }: Props) => {
  // console.log(grant);
  // if (grant.assignedToUserId) {
  //   let user = await prisma.user.findUnique({
  //     where: { id: grant.assignedToUserId },
  //   });
  // }

  if (!grant.assignedToUserId) return null;
  const user = await prisma.user.findUnique({
    where: { id: grant.assignedToUserId },
  });

  return (
    <Flex direction="column" gap="3">
      <Heading>{grant.title}</Heading>

      <Flex gap="3" my="2">
        <GrantStatusBadge status={grant.status} />
        <Text>{grant.updatedAt.toDateString()}</Text>
      </Flex>

      <Card className="prose max-w-full" mt="4">
        <ReactMarkdown>{grant.description}</ReactMarkdown>
      </Card>

      <CustomFiledDetails subheading="Acronym" fieldInfo={grant.acronym} />

      <CustomFiledDetails subheading="Budget" fieldInfo={grant.budgetTotal} />

      <CustomFiledDetails
        subheading="Submission date"
        fieldInfo={grant.submissionDate?.toDateString() ?? null}
        //===   fieldInfo={grant.submissionDate ? grant.submissionDate.toDateString() : null}
      />

      <CustomFiledDetails
        subheading="Deadline"
        fieldInfo={grant.deadline?.toDateString() ?? null}
      />

      <CustomFiledDetails
        subheading="Decision date"
        fieldInfo={grant.decisionDate?.toDateString() ?? null}
      />

      <CustomFiledDetails
        subheading="Project start date"
        fieldInfo={grant.projectStartDate?.toDateString() ?? null}
      />

      <CustomFiledDetails subheading="Notes" fieldInfo={grant.notes} />

      <CustomFiledDetails
        subheading="Project Number"
        fieldInfo={grant.projectNumber}
      />

      <CustomFiledDetails
        subheading="Applicant user"
        fieldInfo={user?.lastName ?? null}
      />

      <CustomFiledDetails
        subheading="Grant status"
        fieldInfo={grant.status ?? null}
      />
    </Flex>
  );
};

export default GrantDetails;
