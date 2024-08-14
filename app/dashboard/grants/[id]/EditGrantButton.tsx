"use client";
import { Spinner } from "@/app/components";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";

interface Props {
  grantId: string;
}

const EditGrantButton = ({ grantId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button onClick={() => setIsLoading(true)} disabled={isLoading}>
      {isLoading && <Spinner />}
      <Pencil2Icon />
      <Link href={`/dashboard/grants/edit/${grantId}`}>Edit Grant</Link>
    </Button>
  );
};

export default EditGrantButton;
