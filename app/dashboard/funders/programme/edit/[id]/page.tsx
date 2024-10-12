import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import FundingProgrammeForm from "../../../_components/FundingProgrammeForm";

interface Props {
  params: { id: string };
}

const EditFundingProgrammePage = async ({ params }: Props) => {
  const fProgramme = await prisma?.fundingProgramme.findUnique({
    where: { id: params.id },
  });

  if (!fProgramme) notFound(); // null check

  return <FundingProgrammeForm fProgramme={fProgramme} />;
};

export default EditFundingProgrammePage;
