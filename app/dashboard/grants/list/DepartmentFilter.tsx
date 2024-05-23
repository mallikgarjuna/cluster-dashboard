import { Select, SelectItem } from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import React from "react";

const departShortNames = Object.values(OSDepartmentShortName);

const DepartmentFilter = () => {
  return (
    <div>
      <Select label="Filter by department...">
        {departShortNames.map((department) => (
          <SelectItem key={department} value={department}>
            {department}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default DepartmentFilter;
