import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditGrantButton from "./EditGrantButton";
import GrantDetails from "./GrantDetails";
import DeleteGrantButton from "./DeleteGrantButton";

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
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      {/* sm in Radix === md in TWcss */}
      <Box className="md:col-span-4">
        <GrantDetails grant={grant} />
      </Box>
      <Box>
        <Flex direction="column" gap="2">
          <EditGrantButton grantId={grant.id} />
          <DeleteGrantButton />
        </Flex>
      </Box>
    </Grid>
  );
};

export default GrantDetailPage;
