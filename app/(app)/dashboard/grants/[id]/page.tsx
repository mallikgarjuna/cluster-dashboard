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
      <Box className="md:col-span-4">
        <GrantDetails grant={grant} />
      </Box>
      <Box className="md:pl-2">
        <Flex
          direction="column"
          gap="3"
          className="section-panel overflow-hidden p-0 md:sticky md:top-6"
        >
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Actions
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
              Manage this record or return to the grants list.
            </p>
          </div>
          <div className="space-y-3 px-4 pb-4">
          {(session?.user.role === "ADMIN" ||
            session?.user.id === grant.assignedToUserId) && (
            <>
              <EditGrantButton grantId={grant.id!} />
              <DeleteGrantButton grantId={grant.id!} />
            </>
          )}
          <GoBackButton />
          </div>
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
