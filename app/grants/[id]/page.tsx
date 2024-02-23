import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const GrantDetailPage = async ({ params }: Props) => {
  if (typeof params.id !== "number") notFound();

  const grant = await prisma.grant.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!grant) notFound();

  return (
    <div>
      <p>{grant.title}</p>
      <p>{grant.description}</p>
      <p>{grant.status}</p>
      <p>{grant.updatedAt.toDateString()}</p>
    </div>
  );
};

export default GrantDetailPage;
