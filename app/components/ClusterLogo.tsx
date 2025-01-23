import Link from "next/link";
import { GrCluster } from "react-icons/gr";

const ClusterLogo = () => {
  return (
    <div className={`flex flex-row items-center gap-3`}>
      <Link href="/">
        <GrCluster style={{ color: "black" }} />
      </Link>
      <span className="text-3xl">Cluster Dashboard</span>
    </div>
  );
};

export default ClusterLogo;
