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
    color: "blue" | "green" | "red" | "orange" | "purple" | "gray" | "tomato";
  }
> = {
  SUBMITTED: { label: "Submitted", color: "blue" },
  AWARDED: { label: "Awarded", color: "green" },
  REJECTED: { label: "Rejected", color: "red" },
  RUNNING_PROJECT: { label: "Running project", color: "orange" },
  ENDED_PROJECT: { label: "Ended project", color: "purple" },
  DRAFT: { label: "Draft", color: "gray" },
  DELETED: { label: "Deleted", color: "tomato" },
};

const GrantStatusBadge = ({ status }: Props) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default GrantStatusBadge;
