import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditGrantButton from "./EditGrantButton";
import GrantDetails from "./GrantDetails";
import DeleteGrantButton from "./DeleteGrantButton";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import { Metadata } from "next";
import { cache } from "react";
import { Button } from "@nextui-org/react";
import GoBackButton from "./GoBackButton";

interface Props {
  params: { id: string };
}

const fetchGrant = cache((grantId: string) =>
  prisma.grant.findUnique({ where: { newId: grantId } })
);

const GrantDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (typeof parseInt(params.id) !== "number") notFound();

  const grant = await fetchGrant(params.id);
  // const grant = await fetchGrant(parseInt(params.id));
  // console.log("Grant details received: ", grant);

  if (!grant) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      {/* sm in Radix === md in TWcss */}
      <Box className="md:col-span-4">
        <GrantDetails grant={grant} />
      </Box>
      <Box>
        <Flex direction="column" gap="2">
          {(session?.user.role === "ADMIN" ||
            session?.user.id === grant.assignedToUserId) && (
            <>
              {/* <AssigneeSelect grant={grant} /> */}
              <EditGrantButton grantId={grant.newId!} />
              <DeleteGrantButton grantId={grant.newId!} />
            </>
          )}
          <GoBackButton />
        </Flex>
      </Box>
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const grant = await fetchGrant(params.id);
  // const grant = await fetchGrant(parseInt(params.id));

  return {
    title: grant?.title,
    description: "Details of grant " + grant?.newId,
  };
}

export default GrantDetailPage;
