import React from "react";
import NavBarDashboard from "./_ui/NavBarDashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <NavBarDashboard />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
