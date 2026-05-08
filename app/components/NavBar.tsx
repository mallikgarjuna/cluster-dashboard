"use client";

import { Skeleton } from "@/app/components";
import { Button } from "@/components/ui/button";
import { Container, Flex } from "@radix-ui/themes";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GrCluster } from "react-icons/gr";
import LogOutButton from "./auth/LogOutButton";

const links = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

const NavBar = () => {
  const currentPath = usePathname();
  const [loading, setLoading] = useState("");

  const { data: session, status } = useSession();

  return (
    <nav className="border-b px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex gap="3" align="center">
            <Link href="/">
              <GrCluster />
              {/* <ClusterLogo /> */}
            </Link>
            {/* <NavLinks /> */}
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
                  </Link>
                </li>
              ))}
            </ul>
          </Flex>
          <Flex gap="3" align="center">
            {/* <AuthStatus /> */}
            {status === "loading" && <Skeleton width="4rem" />}

            {status === "unauthenticated" && (
              <>
                <Link className="nav-link" href="/auth/login">
                  Log in
                </Link>
              </>
            )}

            {status === "authenticated" && (
              <Flex gap="3" align="center">
                <p>User role: {session?.user?.role}</p>

                <Button asChild variant="outline">
                  <Link href="/profile">
                  {`${session.user.firstName} ${session.user.lastName}`}
                  </Link>
                </Button>

                <LogOutButton />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

// const NavLinks = () => {
//   const currentPath = usePathname();
//   const [loading, setLoading] = useState("");

//   const links = [
//     { label: "Home", href: "/" },
//     { label: "Dashboard", href: "/dashboard" },
//     { label: "Admin", href: "/admin" },
//   ];

//   // console.log("Current path: ", currentPath);
//   // console.log("Loading: ", loading);

//   return (
//     <ul className="flex space-x-6">
//       {links.map((link) => (
//         <li key={link.href}>
//           <Link
//             className={classnames({
//               "nav-link": true,
//               "!text-blue-900": link.href === currentPath,
//             })}
//             href={link.href}
//             onClick={() => setLoading(link.href)}
//           >
//             {link.label}
//             {/* {loading === link.href && currentPath !== link.href ? (
//               <Spinner size="sm" />
//             ) : null} */}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// };

// const AuthStatus = () => {
//   const { data: session, status } = useSession();
//   // console.log("Status: ", status);
//   // console.log("Session: ", session);

//   if (status === "loading") return <Skeleton width="4rem" />;

//   if (status === "unauthenticated")
//     return (
//       <>
//         {/* <Link className="nav-link" href="/api/auth/signin">
//           Sign in
//         </Link> */}
//         {/* <Button onClick={() => signIn()}>Sign in</Button> */}
//         <Link className="nav-link" href="/auth/login">
//           Log in
//         </Link>
//         {/* <Link className="nav-link" href="/auth/signup">
//           Sign up
//         </Link> */}
//       </>
//     );

//   return (
//     <Box>
//       {status === "authenticated" && (
//         <Flex gap="3" align="center">
//           <p>User role: {session?.user?.role}</p>

//           <Button as={Link} href="/profile" variant="faded">
//             {`${session.user.firstName} ${session.user.lastName}`}
//           </Button>

//           <LogOutButton />
//         </Flex>
//       )}
//     </Box>
//   );
// };

export default NavBar;
