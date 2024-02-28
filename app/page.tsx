import Image from "next/image";
import Pagination from "./components/Pagination";

export default function Home() {
  return (
    <>
      <div>Cluster Dashboard</div>
      <Pagination itemsCount={100} pageSize={10} currentPage={1} />
    </>
  );
}
