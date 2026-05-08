import { checkAuth } from "@/lib/server-utils";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { cache } from "react";
import DeleteGrantButton from "./DeleteGrantButton";
import EditGrantButton from "./EditGrantButton";
import GoBackButton from "./GoBackButton";
import GrantDetails from "./GrantDetails";

interface Props {
  params: { id: string };
}

const fetchGrant = cache((grantId: string) =>
  prisma.grant.findUnique({
    where: { id: grantId },
    include: {
      assignedToUser: true,
      createdByUser: true,
      relatedFundingAgency: true,
      relatedFundingProgramme: true,
      relatedFundingAction: true,
      relatedFundingCall: true,
    },
  }),
);

const GrantDetailPage = async ({ params }: Props) => {
  const session = await checkAuth();

  // if (typeof parseInt(params.id) !== "number") notFound();

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
      <Box className="md:pl-2">
        <Flex direction="column" gap="2" className="section-panel p-3 md:sticky md:top-6">
          {(session?.user.role === "ADMIN" ||
            session?.user.id === grant.assignedToUserId) && (
            <>
              {/* <AssigneeSelect grant={grant} /> */}
              <EditGrantButton grantId={grant.id!} />
              <DeleteGrantButton grantId={grant.id!} />
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
    description: "Details of grant " + grant?.id,
  };
}

export default GrantDetailPage;
