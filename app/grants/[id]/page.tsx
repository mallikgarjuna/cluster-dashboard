import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import GrantStatusBadge from "@/app/components/GrantStatusBadge";

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
    <div>
      <Heading>{grant.title}</Heading>
      <Flex gap="3" my="2">
        <GrantStatusBadge status={grant.status} />
        <Text>{grant.updatedAt.toDateString()}</Text>
      </Flex>
      <Card>
        <p>{grant.description}</p>
      </Card>
    </div>
  );
};

export default GrantDetailPage;
