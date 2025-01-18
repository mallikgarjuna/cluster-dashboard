"use client";

import { Skeleton } from "@/app/components";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Box, Container, Flex } from "@radix-ui/themes";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GrCluster } from "react-icons/gr";

const NavBar = () => {
  return (
    <nav className="mb-0 border-b px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex gap="3" align="center">
            <Link href="/">
              <GrCluster />
            </Link>
            <NavLinks />
          </Flex>
          <Flex gap="3" align="center">
            <AuthStatus />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();
  const [loading, setLoading] = useState("");

  const links = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin" },
  ];

  // console.log("Current path: ", currentPath);
  // console.log("Loading: ", loading);

  return (
    <ul className="flex space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            className={classnames({
              "nav-link": true,
              "!text-blue-900": link.href === currentPath,
            })}
            href={link.href}
            onClick={() => setLoading(link.href)}
          >
            {link.label}
            {/* {loading === link.href && currentPath !== link.href ? (
              <Spinner size="sm" />
            ) : null} */}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const AuthStatus = () => {
  const { data: session, status } = useSession();
  // console.log("Status: ", status);
  // console.log("Session: ", session);

  if (status === "loading") return <Skeleton width="4rem" />;

  if (status === "unauthenticated")
    return (
      <>
        {/* <Link className="nav-link" href="/api/auth/signin">
          Sign in
        </Link> */}
        {/* <Button onClick={() => signIn()}>Sign in</Button> */}
        <Link className="nav-link" href="/auth/signin">
          Sign in
        </Link>
        {/* <Link className="nav-link" href="/auth/signup">
          Sign up
        </Link> */}
      </>
    );

  return (
    <Box>
      {status === "authenticated" && (
        <Flex gap="3" align="center">
          <p>User role: {session?.user?.role}</p>
          <Dropdown>
            <DropdownTrigger>
              {/* <Text>{session.user?.email}</Text> */}
              <Button variant="light">
                {`${session.user.firstName} ${session.user.lastName}`}
                <CaretDownIcon />
              </Button>
              {/* Image doesn't exist for credentials login, so use email text display */}
              {/* <Avatar
              src={session.user!.image!}
              fallback="?"
              size="2"
              radius="full"
            /> */}
            </DropdownTrigger>
            <DropdownMenu aria-label="Static-Actions">
              <DropdownItem key="email">{session.user!.email}</DropdownItem>
              <DropdownItem key="profile" as={Link} href="/profile">
                Profile
              </DropdownItem>
              <DropdownItem key="signout" as={Link} href="/api/auth/signout">
                Sign out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Flex>
      )}
    </Box>
  );
};

export default NavBar;
