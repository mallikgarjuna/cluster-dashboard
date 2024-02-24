import { GrantStatusBadge } from "@/app/components";
import { Grant } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

interface Props {
  grant: Grant;
}

const GrantDetails = ({ grant }: Props) => {
  return (
    <>
      <Heading>{grant.title}</Heading>
      <Flex gap="3" my="2">
        <GrantStatusBadge status={grant.status} />
        <Text>{grant.updatedAt.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-full" mt="4">
        <ReactMarkdown>{grant.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default GrantDetails;
