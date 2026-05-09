"use client";

import { Table } from "@radix-ui/themes";
// import { TableCellProps } from "@radix-ui/react-table";
import { Link } from "@/app/components";
import React, { useEffect, useState } from "react";
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
  // console.log("pathname: ", pathname);

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

  const BorderedRow = (props: any) => (
    <Table.Row
      {...props}
      style={{ borderBottom: "1px solid #E8E8EC" }}
      className="transition-colors duration-200 hover:bg-[var(--color-surface-muted)]"
    />
  );

  const fAgencyCellContent = (fAgency: FundingAgencyWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link
          href={`/dashboard/funders/agency/edit/${fAgency.id}`}
          className="font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:text-[var(--color-primary)]"
        >
          {fAgency.name}
        </Link>
        <p className="text-[var(--color-text-muted)]">({fAgency.grants.length})</p>
      </div>
    );
  };

  const fProgrammeCellContent = (fP: FundingProgrammeWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link
          href={`/dashboard/funders/programme/edit/${fP.id}`}
          className="font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:text-[var(--color-primary)]"
        >
          {fP.name}
        </Link>
        <p className="text-[var(--color-text-muted)]">({fP.grants.length})</p>
      </div>
    );
  };

  const fActionCellContent = (fA: FundingActionWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link
          href={`/dashboard/funders/action/edit/${fA.id}`}
          className="font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:text-[var(--color-primary)]"
        >
          {fA.name}
        </Link>
        <p className="text-[var(--color-text-muted)]">({fA.grants.length})</p>
      </div>
    );
  };

  const fCallCellContent = (fC: FundingCallWithAllRelatedTypes) => {
    return (
      <div className="flex gap-2">
        <Link
          href={`/dashboard/funders/call/edit/${fC.id}`}
          className="font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:text-[var(--color-primary)]"
        >
          {fC.name}
        </Link>
        <p className="text-[var(--color-text-muted)]">({fC.grants.length})</p>
      </div>
    );
  };

  // Count the grants for each funding agency
  return (
    <div className="section-panel mt-2 flex flex-col gap-4 p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-secondary)]">
            Reference Table
          </p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
            Funders Table
          </h2>
        </div>
        <Table.Root
          variant="surface"
          size={"1"}
          className="rounded-xl border border-[var(--color-border)] bg-white"
        >
          <Table.Header>
            <Table.Row className="bg-[var(--color-surface-muted)]">
              {columnsFundersTable.map((column) => (
                <Table.ColumnHeaderCell
                  key={column.key}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]"
                >
                  {column.value}
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fetchedFundingAgencies
              ?.filter(
                (fAg: FundingAgencyWithProgrammesActionsCallsAndGrants) =>
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
                          pathname === "/dashboard"
                            ? fp.grants.length > 0
                            : true,
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
                                              <Table.Cell className="text-[var(--color-text-secondary)]">
                                                {fcIndex === 0 &&
                                                faIndex === 0 &&
                                                fpIndex === 0
                                                ? fAgencyCellContent(fagency)
                                                : null}
                                            </Table.Cell>
                                              <Table.Cell className="text-[var(--color-text-secondary)]">
                                                {fcIndex === 0 && faIndex == 0
                                                  ? fProgrammeCellContent(fp)
                                                  : null}
                                              </Table.Cell>
                                              <Table.Cell className="text-[var(--color-text-secondary)]">
                                                {fcIndex === 0
                                                  ? fActionCellContent(fa)
                                                  : null}
                                              </Table.Cell>
                                              <Table.Cell className="text-[var(--color-text-secondary)]">
                                                {fCallCellContent(fc)}
                                              </Table.Cell>
                                          </BorderedRow>
                                        ))
                                    ) : (
                                      <BorderedRow key={fa.id}>
                                        <Table.Cell className="text-[var(--color-text-secondary)]">
                                          {faIndex === 0 && fpIndex === 0
                                            ? fAgencyCellContent(fagency)
                                            : null}
                                        </Table.Cell>
                                        <Table.Cell className="text-[var(--color-text-secondary)]">
                                          {faIndex == 0
                                            ? fProgrammeCellContent(fp)
                                            : null}
                                        </Table.Cell>
                                        <Table.Cell className="text-[var(--color-text-secondary)]">
                                          {fActionCellContent(fa)}
                                        </Table.Cell>
                                        <Table.Cell className="text-[var(--color-text-muted)]">
                                          No Funding Calls
                                        </Table.Cell>
                                      </BorderedRow>
                                    )}
                                  </React.Fragment>
                                ))
                            ) : (
                              <BorderedRow key={fp.id}>
                                <Table.Cell className="text-[var(--color-text-secondary)]">
                                  {fpIndex === 0
                                    ? fAgencyCellContent(fagency)
                                    : null}
                                </Table.Cell>
                                <Table.Cell className="text-[var(--color-text-secondary)]">
                                  {fProgrammeCellContent(fp)}
                                </Table.Cell>
                                <Table.Cell className="text-[var(--color-text-muted)]">No Funding Actions</Table.Cell>
                                <Table.Cell className="text-[var(--color-text-muted)]">No Funding Calls</Table.Cell>
                              </BorderedRow>
                            )}
                          </React.Fragment>
                        ))
                    ) : (
                      <BorderedRow key={fagency.id}>
                        <Table.Cell className="text-[var(--color-text-secondary)]">{fAgencyCellContent(fagency)}</Table.Cell>
                        <Table.Cell className="text-[var(--color-text-muted)]">No Funding Programmes</Table.Cell>
                        <Table.Cell className="text-[var(--color-text-muted)]">No Funding Actions</Table.Cell>
                        <Table.Cell className="text-[var(--color-text-muted)]">No Funding Calls</Table.Cell>
                      </BorderedRow>
                    )}
                  </React.Fragment>
                ),
              )}
          </Table.Body>
        </Table.Root>
    </div>
  );
};

export default FundersTable;
