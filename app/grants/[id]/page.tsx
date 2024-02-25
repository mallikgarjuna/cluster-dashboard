import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditGrantButton from "./EditGrantButton";
import GrantDetails from "./GrantDetails";
import DeleteGrantButton from "./DeleteGrantButton";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";

interface Props {
  params: { id: string };
}

const GrantDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
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
      {session && (
        <Box>
          <Flex direction="column" gap="2">
            <AssigneeSelect />
            <EditGrantButton grantId={grant.id} />
            <DeleteGrantButton grantId={grant.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export default GrantDetailPage;
