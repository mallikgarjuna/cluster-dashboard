"use client";

import Link from "@/app/components/Link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { OSDepartmentShortName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// type APIResponseData = {
type RowData = {
  piID: string;
  piDepartment: string; //OSDepartmentShortName | "Unknown";
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

interface Props {
  grantsCountOfPIData?: RowData[];
}

// const PIGrantsTable = ({ grantsCountOfPIData: rows }: Props) => {
const PIGrantsTable = () => {
  const [rows, setRows] = useState<RowData[]>(initialRowData);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const queryString = params.size ? "?" + params.toString() : "";

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/grants/grantsCountOfPI${queryString}`,
        );
        if (!response.ok)
          throw new Error("Failed to fetch grantsCountOfPI API");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching grantsCountOfPI API: ", error);
      }
    };
    fetchData();
  }, [queryString]);

  const columns: { key: keyof RowData; label: string }[] = [
    { key: "pi", label: "PI Name" },
    { key: "submitted", label: "Submitted" },
    { key: "awaiting", label: "Awaiting" },
    { key: "awarded", label: "Awarded" },
    { key: "rejected", label: "Rejected" },
    { key: "successRate", label: "Success Rate %" },
    { key: "budgetAppliedFor", label: "Budget Applied For" },
    { key: "budgetAwarded", label: "Budget Awarded" },
  ];

  // let departments = Object.values(OSDepartmentShortName);
  let departments =
    searchParams.get("department") && searchParams.get("department") !== "All"
      ? [searchParams.get("department")]
      : Object.values(OSDepartmentShortName);

  // If a groupleader logged in, Show the corresponding dept, not all depts;
  if (session?.user.role === "GROUPLEADER") {
    departments = departments.filter(
      (dept) => dept === session.user.relatedDepartment?.nameShort,
    );
  }
  // console.log("Departmetns: ", departments);

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold">{`PI Grants Overview - Tables`}</h1>
      {departments.map((dept) => (
        <div key={dept}>
          <h1 className="text-lg font-bold">{`${dept}:`}</h1>
          <Table
            aria-label={`PI Grants Table for ${dept}`}
            className="mb-4"
            key={dept}
            classNames={{
              tr: "hover:bg-gray-200 transition-colors",
            }}
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
                      {/* {columnKey !== "piID" && item[columnKey as keyof RowData]} */}
                      {columnKey !== "piID" && (
                        <>
                          {columnKey === "pi" ? (
                            <Link
                              href={`/dashboard/grants/list?groupLeader=${item.piID}`}
                              className="text-blue-600"
                            >
                              {item[columnKey as keyof RowData]}
                            </Link>
                          ) : (
                            item[columnKey as keyof RowData]
                          )}
                        </>
                      )}
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
