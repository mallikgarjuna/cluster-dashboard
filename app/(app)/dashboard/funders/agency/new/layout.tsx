import { Metadata } from "next";
import React from "react";

export default function NewFundingAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

// Since the page.tsx is a client component, we need to define the metadata here in the layout.tsx
// Even though the page.tsx does not need to use 'use client', it helped me to understand the concept of using metadata in the layout.tsx
// As you can see, I did not 'use client' in other funders page;
export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a New Funding Agency",
  description: "Create a new funding agency",
};

// export default NewFundingAgencyLayout;
