import React from "react";
import { GrCluster } from "react-icons/gr";
import { lusitana } from "./fonts";
import Link from "next/link";

const ClusterLogo = () => {
  return (
    <div className={`${lusitana.className} flex flex-row items-center gap-3`}>
      <Link href="/">
        <GrCluster style={{ color: "black" }} />
      </Link>
      <span className="text-3xl">Cluster Dashboard</span>
    </div>
  );
};

export default ClusterLogo;
