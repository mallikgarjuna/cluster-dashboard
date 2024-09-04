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
    <div>
      <NextLink
        href={href}
        className={className}
        prefetch={false}
        passHref
        legacyBehavior
      >
        <RadixLink>{children}</RadixLink>
      </NextLink>
    </div>
  );
};

export default Link;
