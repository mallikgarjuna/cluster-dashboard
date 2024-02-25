"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { GrCluster } from "react-icons/gr";
import classnames from "classnames";
import { Box, Container, Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

const NavBar = () => {
  const currentPath = usePathname();
  const { data: session, status } = useSession();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Grants", href: "/grants/list" },
  ];

  return (
    <nav className=" border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex gap="3" align="center">
            <Link href="/">
              <GrCluster />
            </Link>
            <ul className="flex space-x-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className={classnames({
                      "text-zinc-900": link.href === currentPath,
                      "text-zinc-500": link.href !== currentPath,
                      "hover:text-zinc-800 transition-colors": true,
                    })}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Flex>

          <Box>
            {status === "authenticated" && (
              <Link href="/api/auth/signout">Log out</Link>
            )}
            {status === "unauthenticated" && (
              <Link href="/api/auth/signin">Log in</Link>
            )}
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
