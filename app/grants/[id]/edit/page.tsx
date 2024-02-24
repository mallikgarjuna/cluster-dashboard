import React from "react";
import GrantForm from "../../_components/GrantForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const EditGrantPage = async ({ params }: Props) => {
  if (typeof parseInt(params.id) !== "number") notFound();

  const grant = await prisma.grant.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!grant) notFound();

  return <GrantForm grant={grant} />;
};

export default EditGrantPage;
