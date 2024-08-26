import dynamic from "next/dynamic";
import GrantFormSkeleton from "./loading";
import { Metadata } from "next";

// import GrantForm from "../_components/GrantForm";
// lazyloading
const GrantForm = dynamic(
  () => import("@/app/dashboard/grants/_components/GrantForm"),
  {
    ssr: false,
    loading: () => <GrantFormSkeleton />,
  },
);

const NewGrantPage = () => {
  return <GrantForm />;
};

export const metadata: Metadata = {
  title: "Cluster Dashboard - Create a new Grant",
  description: "Create a new grant",
};

export default NewGrantPage;
