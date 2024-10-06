import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import FundingActionForm from "../../../_components/FundingActionForm";

interface Props {
  params: { id: string };
}

const EditFundingActionPage = async ({ params }: Props) => {
  const fAction = await prisma?.fundingAction.findUnique({
    where: { id: params.id },
  });

  if (!fAction) return notFound(); // null check

  return <FundingActionForm fAction={fAction} />;
};

export default EditFundingActionPage;
