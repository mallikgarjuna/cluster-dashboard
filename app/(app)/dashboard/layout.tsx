import React from "react";
import NavBarDashboard from "./_ui/NavBarDashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <div>
        <NavBarDashboard />
      </div>
      <div className="page-shell pt-0">{children}</div>
    </div>
  );
};

export default DashboardLayout;
