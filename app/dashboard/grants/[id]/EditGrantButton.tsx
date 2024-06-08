import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  grantId: string;
}

const EditGrantButton = ({ grantId }: Props) => {
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/dashboard/grants/edit/${grantId}`}>Edit Grant</Link>
    </Button>
  );
};

export default EditGrantButton;
