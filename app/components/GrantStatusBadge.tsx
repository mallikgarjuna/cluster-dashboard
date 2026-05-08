import { StatusGrant } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: StatusGrant;
}

const statusMap: Record<
  StatusGrant,
  {
    label: string;
    color: "blue" | "gray";
  }
> = {
  SUBMITTED: { label: "Submitted", color: "blue" },
  AWARDED: { label: "Awarded", color: "blue" },
  REJECTED: { label: "Rejected", color: "gray" },
  RUNNING_PROJECT: { label: "Running project", color: "gray" },
  ENDED_PROJECT: { label: "Ended project", color: "gray" },
  DRAFT: { label: "Draft", color: "gray" },
  DELETED: { label: "Deleted", color: "gray" },
};

const GrantStatusBadge = ({ status }: Props) => {
  return (
    <Badge color={statusMap[status].color} variant="soft">
      {statusMap[status].label}
    </Badge>
  );
};

export default GrantStatusBadge;
