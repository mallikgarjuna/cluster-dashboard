import prisma from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditGrantButton from "./EditGrantButton";
import GrantDetails from "./GrantDetails";

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
        <GrantDetails grant={grant} />
      </Box>
      <Box>
        <EditGrantButton grantId={grant.id} />
      </Box>
    </Grid>
  );
};

export default GrantDetailPage;
