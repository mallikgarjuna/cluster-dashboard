"use client";

import Link from "@/app/components/Link";
import { Table } from "@radix-ui/themes";
import { OSDepartmentShortName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PIGrantTableSkeleton from "./PIGrantTableSkeleton";

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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false); // Set loading state to false after fetching data
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

  // console.log("Departmetns: ", departments);

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

  if (loading) {
    // return <div>Loading...</div>; // Render a loading state while data is being fetched
    return <PIGrantTableSkeleton />; // Render a skeleton UI while data is being fetched
  }

  // Check that the departments array is always defined and has the same length on both server and client. If it can be empty, consider adding a conditional rendering to handle that case.
  if (!departments || departments.length === 0) {
    return <div>No data available for departments.</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">{`PI Grants Overview - Tables`}</h1>
      <em className="mb-5 text-xs">
        {" "}
        * Success Rate % = (# of Awarded) / (# of Submitted - # of Awaiting){" "}
      </em>
      {departments.map((dept) => (
        <div key={dept} className="mt-5">
          <h1 className="text-lg font-bold">{`${dept}:`}</h1>
          <Table.Root
            aria-label={`PI Grants Table for ${dept}`}
            className="mb-10"
            key={dept}
            variant="surface"
            size={"1"}
          >
            <Table.Header>
              <Table.Row>
                {columns.map((column) => (
                  <Table.ColumnHeaderCell key={column.key}>
                    {column.label}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows
                .filter((row) => row.piDepartment === dept)
                .map((row: RowData) => (
                  <Table.Row
                    key={row.piID}
                    className="transition-colors hover:bg-gray-200"
                  >
                    {columns.map((column) => (
                      <Table.Cell key={column.key}>
                        {column.key !== "piID" &&
                          column.key !== "piDepartment" && (
                            <>
                              {column.key === "pi" ? (
                                <Link
                                  href={`/dashboard/grants/list?groupLeader=${row.piID}`}
                                  className="text-blue-600"
                                >
                                  {row[column.key as keyof RowData]}
                                </Link>
                              ) : (
                                row[column.key as keyof RowData]
                              )}
                            </>
                          )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              <Table.Row className="bg-gray-300">
                <Table.Cell className="font-bold">Total</Table.Cell>
                {columns.slice(1).map((column) => (
                  <Table.Cell key={column.key} className="font-bold">
                    {column.key === "successRate"
                      ? (
                          rows
                            .filter((row) => row.piDepartment === dept)
                            .reduce((acc, row) => {
                              const submitted = row.submitted;
                              const awaiting = row.awaiting;
                              return submitted - awaiting > 0
                                ? acc +
                                    (row.awarded / (submitted - awaiting)) * 100
                                : acc;
                            }, 0) /
                          rows.filter((row) => row.piDepartment === dept).length
                        )
                          .toFixed(2)
                          .toString()
                      : rows
                          .filter((row) => row.piDepartment === dept)
                          .reduce((acc, row) => {
                            const value = row[column.key as keyof RowData];
                            if (typeof value === "number") {
                              return acc + value;
                            }
                            return acc;
                          }, 0)
                          .toString()}
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </div>
      ))}
    </div>
  );
};

export default PIGrantsTable;
