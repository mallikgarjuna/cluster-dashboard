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
import TanSackQueryClientProvider from "./providers/TanSackQueryClientProvider";
import { bodySans, codeMono, displaySans } from "../lib/fonts";

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
      <body
        className={`${bodySans.variable} ${displaySans.variable} ${codeMono.variable} font-sans`}
      >
        <AuthSessionProvider>
          <TanSackQueryClientProvider>
            <Theme
              accentColor="indigo"
              grayColor="sand"
              radius="medium"
              scaling="100%"
            >
              <main className="min-h-screen bg-[var(--color-background)]">
                <Toaster
                  toastOptions={{
                    duration: 5000,
                  }}
                />
                <NextTopLoader color="#6366F1" showSpinner={false} />
                {children}
              </main>
            </Theme>
          </TanSackQueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
