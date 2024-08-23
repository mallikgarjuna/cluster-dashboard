"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

type RowData = {
  piID: string;
  pi: string | null;
  submitted: number;
  awaiting: number;
  awarded: number;
  rejected: number;
  successRate: number;
  budgetAppliedFor: number;
  budgetAwarded: number;
};

// Sample data if no data is fetched
const initialRowData: RowData[] = [
  {
    piID: "1",
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

  return (
    <div>
      <h1 className="text-xl font-bold">PI Grants Table</h1>
      <Table aria-label="PI Grants Table" className="mb-40 mt-2">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <TableRow key={row.piID}>
              {(columnKey) => (
                <TableCell>
                  {columnKey !== "piID" && row[columnKey as keyof RowData]}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PIGrantsTable;
