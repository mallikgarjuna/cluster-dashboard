import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  grantId: number;
}

const EditGrantButton = ({ grantId }: Props) => {
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/grants/${grantId}/edit`}>Edit Grant</Link>
    </Button>
  );
};

export default EditGrantButton;
