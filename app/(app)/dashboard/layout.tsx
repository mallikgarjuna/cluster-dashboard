import React from "react";
import NavBarDashboard from "./_ui/NavBarDashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <div>
        <NavBarDashboard />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
