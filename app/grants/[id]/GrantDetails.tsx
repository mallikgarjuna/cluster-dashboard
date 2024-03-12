import { GrantStatusBadge } from "@/app/components";
import { Grant } from "@prisma/client";
import { Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import CustomFiledDetails from "./CustomFiledDetails";

interface Props {
  grant: Grant;
}

const GrantDetails = ({ grant }: Props) => {
  // console.log(grant);
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

      <CustomFiledDetails subheading="Notes" fieldInfo={grant.notes} />
    </Flex>
  );
};

export default GrantDetails;
