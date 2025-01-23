import "@radix-ui/themes/styles.css";
// import "./theme-config.css";
import "@/app/styles/theme-config.css";
// import "./globals.css";
import "@/app/styles/globals.css";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import AuthSessionProvider from "./providers/AuthSessionProvider";
import { NextUIComponentsProvider } from "./providers/NextUIComponentsProvider";
import TanSackQueryClientProvider from "./providers/TanSackQueryClientProvider";
import { inter } from "../lib/fonts";

export const metadata: Metadata = {
  title:
    "Cluster dashboard - Research data dashbard for the cluster BST at UMCG",
  description: "Researc data dashboard for the cluster BST at UMCG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AuthSessionProvider>
          <TanSackQueryClientProvider>
            <NextUIComponentsProvider>
              <Theme>
                {/* <NavBar /> */}
                <main className="mx-auto w-full max-w-[1400px]">
                  {/* <Container> */}
                  <Toaster
                    toastOptions={{
                      duration: 5000,
                    }}
                  />{" "}
                  <NextTopLoader />
                  {children}
                  {/* </Container> */}
                </main>
              </Theme>
            </NextUIComponentsProvider>
          </TanSackQueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
