import Link from "next/link";
import { GrCluster } from "react-icons/gr";

const ClusterLogo = () => {
  return (
    <div className="flex flex-row items-center gap-3">
      <Link
        href="/"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[var(--color-primary)] transition-colors duration-200 hover:bg-[var(--color-primary-soft)]"
      >
        <GrCluster />
      </Link>
      <span className="font-display text-[28px] font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
        Cluster Dashboard
      </span>
    </div>
  );
};

export default ClusterLogo;
