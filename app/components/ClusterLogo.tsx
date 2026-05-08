import Link from "next/link";
import { GrCluster } from "react-icons/gr";

const ClusterLogo = () => {
  return (
    <div className="flex flex-row items-center gap-3">
      <Link
        href="/"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-950 transition-colors hover:bg-zinc-100"
      >
        <GrCluster />
      </Link>
      <span className="text-[28px] font-semibold tracking-[-0.03em] text-zinc-950">
        Cluster Dashboard
      </span>
    </div>
  );
};

export default ClusterLogo;
