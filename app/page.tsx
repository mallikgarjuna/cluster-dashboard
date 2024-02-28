import Image from "next/image";
import Pagination from "./components/Pagination";
import LatestGrants from "./LatestGrants";

export default function Home() {
  return (
    <>
      <div>Cluster Dashboard</div>
      <LatestGrants />
    </>
  );
}
