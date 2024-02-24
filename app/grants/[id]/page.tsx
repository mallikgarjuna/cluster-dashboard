import GrantStatusBadge from "@/app/components/GrantStatusBadge";
import prisma from "@/prisma/client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface Props {
  params: { id: string };
}

const GrantDetailPage = async ({ params }: Props) => {
  if (typeof parseInt(params.id) !== "number") notFound();

  const grant = await prisma.grant.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!grant) notFound();

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box>
        <Heading>{grant.title}</Heading>
        <Flex gap="3" my="2">
          <GrantStatusBadge status={grant.status} />
          <Text>{grant.updatedAt.toDateString()}</Text>
        </Flex>
        <Card className="prose" mt="4">
          <ReactMarkdown>{grant.description}</ReactMarkdown>
        </Card>
      </Box>
      <Box>
        <Button>
          <Pencil2Icon />
          <Link href={`/grants/${grant.id}/edit`}>Edit Grant</Link>
        </Button>
      </Box>
    </Grid>
  );
};

export default GrantDetailPage;
