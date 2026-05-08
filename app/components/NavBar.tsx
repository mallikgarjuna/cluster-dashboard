"use client";

import { Skeleton } from "@/app/components";
import { Button } from "@/components/ui/button";
import { Container, Flex } from "@radix-ui/themes";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GrCluster } from "react-icons/gr";
import LogOutButton from "./auth/LogOutButton";

const links = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

const NavBar = () => {
  const currentPath = usePathname();

  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-xl">
      <Container className="px-6 py-3 md:px-8">
        <Flex justify="between" align="center" gap="4">
          <Flex gap="4" align="center">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-primary-soft)]"
            >
              <GrCluster />
            </Link>
            <div className="hidden md:block">
              <span className="font-display text-sm font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Cluster Dashboard
              </span>
            </div>
            <ul className="flex items-center gap-5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className={classnames({
                      "nav-link": true,
                      "nav-link-active": link.href === currentPath,
                    })}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Flex>
          <Flex gap="3" align="center">
            {status === "loading" && <Skeleton width="4rem" />}

            {status === "unauthenticated" && (
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Log in</Link>
              </Button>
            )}

            {status === "authenticated" && (
              <Flex gap="3" align="center">
                <p className="hidden text-sm text-[var(--color-text-secondary)] md:block">
                  {session?.user?.role}
                </p>

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
