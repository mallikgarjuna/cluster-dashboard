import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import FundingCallForm from "../../../_components/FundingCallForm";

interface Props {
  params: { id: string };
}

const EditFundingCallPage = async ({ params }: Props) => {
  const fCall = await prisma?.fundingCall.findUnique({
    where: { id: params.id },
  });

  if (!fCall) return notFound(); // null check

  return <FundingCallForm fCall={fCall} />;
};

export default EditFundingCallPage;
