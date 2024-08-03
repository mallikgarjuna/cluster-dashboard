import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import GrantFormSkeleton from "./loading";
// import GrantForm from "../../_components/GrantForm";
// lazyloading
const GrantForm = dynamic(
  () => import("@/app/dashboard/grants/_components/GrantForm"),
  {
    ssr: false,
    loading: () => <GrantFormSkeleton />,
  },
);

interface Props {
  params: { id: string };
}

const EditGrantPage = async ({ params }: Props) => {
  // This check is not needed after changing the type of id to string;
  // if (typeof parseInt(params.id) !== "number") notFound();

  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
    // where: { id: parseInt(params.id) },
  });

  if (!grant) notFound();

  return <GrantForm grant={grant} />;
};

export default EditGrantPage;
