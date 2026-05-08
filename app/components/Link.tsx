import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

interface Props {
  href: string;
  className?: string;
  // children: string;
  children: React.ReactNode;
}

const Link = ({ href, className, children }: Props) => {
  return (
    <NextLink href={href} prefetch={false} passHref legacyBehavior>
      <RadixLink className={className}>{children}</RadixLink>
    </NextLink>
  );
};

export default Link;
