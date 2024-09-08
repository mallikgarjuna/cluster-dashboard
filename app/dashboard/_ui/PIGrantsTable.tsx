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
import prisma from "@/prisma/client";

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
  const [departments, setDepartments] = useState<OSDepartmentShortName[]>([]);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const queryString = params.size ? "?" + params.toString() : "";

  const { data: session, status } = useSession();

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

  // let departments = Object.values(OSDepartmentShortName);
  // Initialize departments state
  useEffect(() => {
    const initialDepartments =
      searchParams.get("department") && searchParams.get("department") !== "All"
        ? [searchParams.get("department")]
        : Object.values(OSDepartmentShortName);
    setDepartments(initialDepartments as OSDepartmentShortName[]); // Cast to OSDepartmentShortName[]
  }, [searchParams]);

  // If a groupLeader dropdown is selected, Show the corresponding dept, not all depts;
  useEffect(() => {
    const handleGroupLeader = async () => {
      if (
        searchParams.get("groupLeader") &&
        searchParams.get("groupLeader") !== "All"
      ) {
        // Find the groupLeader's related department
        const groupLeaderId = searchParams.get("groupLeader");

        //  Fech from the API route instead of using prisma directly in this client component
        const response = await fetch(
          `/api/users/withdepartment/${groupLeaderId}`,
        );
        const groupLeaderUser = await response.json();

        if (response.ok) {
          // Show the corresponding dept, not all depts;
          setDepartments((prevDepartments) =>
            prevDepartments.filter(
              (dept) => dept === groupLeaderUser?.relatedDepartment?.nameShort,
            ),
          );
        } else {
          console.error(
            "Error fetching groupLeader with department: ",
            groupLeaderUser.error,
          );
        }
      }
    };
    handleGroupLeader();
  }, [searchParams]);

  console.log("Departmetns: ", departments);

  // If a groupleader logged in, Show the corresponding dept, not all depts;
  useEffect(() => {
    if (session?.user.role === "GROUPLEADER") {
      setDepartments((prevDepartments) =>
        prevDepartments.filter(
          (dept) => dept === session.user.relatedDepartment?.nameShort,
        ),
      );
    }
  }, [session]); // Add session as a dependency
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
