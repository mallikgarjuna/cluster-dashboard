"use client";

import { Table } from "@radix-ui/themes";
// import { TableCellProps } from "@radix-ui/react-table";
import { Link } from "@/app/components";
import React, { useEffect, useState } from "react";
import { useFundingAgencies } from "./FundingProgrammeForm";
import {
  FundingAction,
  FundingAgency,
  FundingCall,
  FundingProgramme,
} from "@prisma/client";
import {
  FundingActionWithAllRelatedTypes,
  FundingAgencyWithAllRelatedTypes,
  FundingAgencyWithProgrammesActionsCallsAndGrants,
  FundingCallWithAllRelatedTypes,
  FundingProgrammeWithAllRelatedTypes,
} from "@/prisma/customTypes";
import { usePathname, useSearchParams } from "next/navigation";

const columnsFundersTable: { key: string; value: string }[] = [
  { key: "fundingAgency", value: "Funding Agency" },
  { key: "fundingProgramme", value: "Funding Programme" },
  { key: "fundingAction", value: "Funding Action" },
  { key: "fundingCall", value: "Funding Call" },
];

const FundersTable = () => {
  const [fetchedFundingAgencies, setFetchedFundingAgencies] =
    useState<any>(null);

  const pathname = usePathname();
  console.log("pathname: ", pathname);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const queryString = params.size ? "?" + params.toString() : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/fundingAgencies${queryString}`);
        if (!response.ok)
          throw new Error("Failed to fetch fundingAgencies API");
        const data: FundingAgencyWithProgrammesActionsCallsAndGrants =
          await response.json();
        setFetchedFundingAgencies(data);
      } catch (error) {
        console.error("Error fetching fundingAgencies API: ", error);
      } finally {
      }
    };

    fetchData();
  }, [queryString]);

  const BorderedCell = (props: any) => (
    <Table.Cell {...props} style={{ borderBottom: "1px solid #e5e5e5" }} />
  );

  const BorderedRow = (props: any) => (
    <Table.Row {...props} style={{ borderBottom: "1px solid #e5e5e5" }} />
  );

  const fAgencyCellContent = (fAgency: FundingAgencyWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link href={`/dashboard/funders/agency/edit/${fAgency.id}`}>
          {fAgency.name}
        </Link>
        <p>({fAgency.grants.length})</p>
      </div>
    );
  };

  const fProgrammeCellContent = (fP: FundingProgrammeWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link href={`/dashboard/funders/programme/edit/${fP.id}`}>
          {fP.name}
        </Link>
        <p>({fP.grants.length})</p>
      </div>
    );
  };

  const fActionCellContent = (fA: FundingActionWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link href={`/dashboard/funders/action/edit/${fA.id}`}>{fA.name}</Link>
        <p>({fA.grants.length})</p>
      </div>
    );
  };

  const fCallCellContent = (fC: FundingCallWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link href={`/dashboard/funders/call/edit/${fC.id}`}>{fC.name}</Link>
        <p>({fC.grants.length})</p>
      </div>
    );
  };

  // Count the grants for each funding agency
  const grantsCountOfFAgencies = (fAgency: FundingAgencyWithAllRelatedTypes) =>
    fAgency.grants.length;

  return (
    <>
      <h2 className="text-3xl">Funders Table</h2>
      <Table.Root variant="surface" size={"1"}>
        <Table.Header>
          <Table.Row>
            {columnsFundersTable.map((column) => (
              <Table.ColumnHeaderCell key={column.key}>
                {column.value}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fetchedFundingAgencies
            ?.filter((fAg: FundingAgencyWithProgrammesActionsCallsAndGrants) =>
              pathname === "/dashboard" ? fAg.grants.length > 0 : true,
            )
            .map(
              (
                fagency: FundingAgencyWithProgrammesActionsCallsAndGrants,
                fagIndex: number,
              ) => (
                <React.Fragment key={fagency.id}>
                  {fagency.fundingProgrammes.length > 0 ? (
                    fagency.fundingProgrammes
                      .filter((fp) =>
                        pathname === "/dashboard" ? fp.grants.length > 0 : true,
                      )
                      .map((fp, fpIndex) => (
                        <React.Fragment key={fp.id}>
                          {fp.fundingActions.length > 0 ? (
                            fp.fundingActions
                              .filter((fa) =>
                                pathname === "/dashboard"
                                  ? fa.grants.length > 0
                                  : true,
                              )
                              .map((fa, faIndex) => (
                                <React.Fragment key={fa.id}>
                                  {fa.fundingCalls.length > 0 ? (
                                    fa.fundingCalls
                                      .filter((fc) =>
                                        pathname === "/dashboard"
                                          ? fc.grants.length > 0
                                          : true,
                                      )
                                      .map((fc, fcIndex) => (
                                        <BorderedRow key={fc.id}>
                                          <Table.Cell>
                                            {fcIndex === 0 &&
                                            faIndex === 0 &&
                                            fpIndex === 0
                                              ? fAgencyCellContent(fagency)
                                              : null}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {fcIndex === 0 && faIndex == 0
                                              ? fProgrammeCellContent(fp)
                                              : null}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {fcIndex === 0
                                              ? fActionCellContent(fa)
                                              : null}
                                          </Table.Cell>
                                          <Table.Cell>
                                            {fCallCellContent(fc)}
                                          </Table.Cell>
                                        </BorderedRow>
                                      ))
                                  ) : (
                                    <BorderedRow key={fa.id}>
                                      <Table.Cell>
                                        {faIndex === 0 && fpIndex === 0
                                          ? fAgencyCellContent(fagency)
                                          : null}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {faIndex == 0
                                          ? fProgrammeCellContent(fp)
                                          : null}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {fActionCellContent(fa)}
                                      </Table.Cell>
                                      <Table.Cell>No Funding Calls</Table.Cell>
                                    </BorderedRow>
                                  )}
                                </React.Fragment>
                              ))
                          ) : (
                            <BorderedRow key={fp.id}>
                              <Table.Cell>
                                {fpIndex === 0
                                  ? fAgencyCellContent(fagency)
                                  : null}
                              </Table.Cell>
                              <Table.Cell>
                                {fProgrammeCellContent(fp)}
                              </Table.Cell>
                              <Table.Cell>No Funding Actions</Table.Cell>
                              <Table.Cell>No Funding Calls</Table.Cell>
                            </BorderedRow>
                          )}
                        </React.Fragment>
                      ))
                  ) : (
                    <BorderedRow key={fagency.id}>
                      <Table.Cell>{fAgencyCellContent(fagency)}</Table.Cell>
                      <Table.Cell>No Funding Programmes</Table.Cell>
                      <Table.Cell>No Funding Actions</Table.Cell>
                      <Table.Cell>No Funding Calls</Table.Cell>
                    </BorderedRow>
                  )}
                </React.Fragment>
              ),
            )}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default FundersTable;
