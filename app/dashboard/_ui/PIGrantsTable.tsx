"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import { useEffect, useState } from "react";

// type APIResponseData = {
type RowData = {
  piID: string;
  piDepartment: OSDepartmentShortName | "Unknown";
  pi: string | null;
  submitted: number;
  awaiting: number;
  awarded: number;
  rejected: number;
  successRate: number;
  budgetAppliedFor: number;
  budgetAwarded: number;
};

// type RowData = Omit<APIResponseData, "piDepartment">;
// type RowData = APIResponseData;

// Sample data if no data is fetched
const initialRowData: RowData[] = [
  {
    piID: "1",
    piDepartment: "Unknown",
    pi: "PI Name",
    submitted: 1,
    awaiting: 1,
    awarded: 1,
    rejected: 1,
    successRate: 20,
    budgetAppliedFor: 1000,
    budgetAwarded: 100,
  },
];

const PIGrantsTable = () => {
  const [rows, setRows] = useState<RowData[]>(initialRowData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/grants/grantsCountOfPI");
      const data = await response.json();
      setRows(data);
    };
    fetchData();
  }, []);

  const columns: { key: keyof RowData; label: string }[] = [
    { key: "pi", label: "PI Name" },
    { key: "submitted", label: "Submitted" },
    { key: "awaiting", label: "Awaiting" },
    { key: "awarded", label: "Awarded" },
    { key: "rejected", label: "Rejected" },
    { key: "successRate", label: "Success Rate" },
    { key: "budgetAppliedFor", label: "Budget Applied For" },
    { key: "budgetAwarded", label: "Budget Awarded" },
  ];

  const departments = Object.values(OSDepartmentShortName);

  return (
    <div>
      {departments.map((dept) => (
        <div key={dept}>
          <h1 className="text-xl font-bold">{`PI Grants Table - ${dept}`}</h1>
          <Table
            aria-label={`PI Grants Table for ${dept}`}
            className="mb-4"
            key={dept}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows.filter((row) => row.piDepartment === dept)}>
              {(item) => (
                <TableRow key={item.piID}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey !== "piID" &&
                        // item[columnKey as keyof RowData] === dept &&
                        item[columnKey as keyof RowData]}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default PIGrantsTable;
