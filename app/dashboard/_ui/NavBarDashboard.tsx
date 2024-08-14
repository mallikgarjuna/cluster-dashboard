"use client";
import { Container, Flex } from "@radix-ui/themes";
import classnames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBarDashboard = () => {
  return (
    <nav className="mb-5 border-b px-5 pb-3">
      <Container>
        <Flex justify="between">
          <Flex gap="3" align="center">
            <NavLinks />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    // { label: "Dashboard", href: "/dashboard" },
    { label: "Grants", href: "/dashboard/grants/list" },
    { label: "Contracts", href: "/dashboard/contracts" },
    { label: "Theses", href: "/dashboard/theses" },
    { label: "Courses", href: "/dashboard/courses" },
    { label: "Outreach", href: "/dashboard/outreach" },
  ];

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
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavBarDashboard;
