import dynamic from "next/dynamic";
import GrantFormSkeleton from "./loading";

// import GrantForm from "../_components/GrantForm";
// lazyloading
const GrantForm = dynamic(
  () => import("@/app/dashboard/grants/_components/GrantForm"),
  {
    ssr: false,
    loading: () => <GrantFormSkeleton />,
  }
);

const NewGrantPage = () => {
  return <GrantForm />;
};

export default NewGrantPage;
