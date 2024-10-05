import { notFound } from "next/navigation";
import FundingAgencyForm from "../../../_components/FundingAgencyForm";

interface Props {
  params: { id: string };
}

const EditFundingAgencyPage = async ({ params }: Props) => {
  const fAgency = await prisma?.fundingAgency.findUnique({
    where: { id: params.id },
  });

  if (!fAgency) notFound();

  return <FundingAgencyForm fAgency={fAgency} />;
};

export default EditFundingAgencyPage;
