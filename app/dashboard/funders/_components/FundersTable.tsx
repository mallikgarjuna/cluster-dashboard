"use client";

import { Table } from "@radix-ui/themes";
// import { TableCellProps } from "@radix-ui/react-table";
import { useFundingAgencies } from "./FundingProgrammeForm";
import React from "react";

const FundersTable = () => {
  const columnsFundersTable: { key: string; value: string }[] = [
    { key: "fundingAgency", value: "Funding Agency" },
    { key: "fundingProgramme", value: "Funding Programme" },
    { key: "fundingAction", value: "Funding Action" },
    { key: "fundingCall", value: "Funding Call" },
  ];

  const { data: fundingAgencies, isLoading, error } = useFundingAgencies();

  const BorderedCell = (props: any) => (
    <Table.Cell {...props} style={{ borderBottom: "1px solid #e5e5e5" }} />
  );

  const BorderedRow = (props: any) => (
    <Table.Row {...props} style={{ borderBottom: "1px solid #e5e5e5" }} />
  );

  return (
    <div>
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
          {fundingAgencies?.map((fagency, fagIndex) => (
            <React.Fragment key={fagency.id}>
              {fagency.fundingProgrammes.length > 0 ? (
                fagency.fundingProgrammes.map((fp, fpIndex) => (
                  <React.Fragment key={fp.id}>
                    {fp.fundingActions.length > 0 ? (
                      fp.fundingActions.map((fa, faIndex) => (
                        <React.Fragment key={fa.id}>
                          {fa.fundingCalls.length > 0 ? (
                            fa.fundingCalls.map((fc, fcIndex) => (
                              <BorderedRow key={fc.id}>
                                <Table.Cell>
                                  {fcIndex === 0 &&
                                  faIndex === 0 &&
                                  fpIndex === 0
                                    ? fagency.name
                                    : null}
                                </Table.Cell>
                                <Table.Cell>
                                  {fcIndex === 0 && faIndex == 0
                                    ? fp.name
                                    : null}
                                </Table.Cell>
                                <Table.Cell>
                                  {fcIndex === 0 ? fa.name : null}
                                </Table.Cell>
                                <Table.Cell>{fc.name}</Table.Cell>
                              </BorderedRow>
                            ))
                          ) : (
                            <BorderedRow key={fa.id}>
                              <Table.Cell>
                                {faIndex === 0 && fpIndex === 0
                                  ? fagency.name
                                  : null}
                              </Table.Cell>
                              <Table.Cell>
                                {faIndex == 0 ? fp.name : null}
                              </Table.Cell>
                              <Table.Cell>{fa.name}</Table.Cell>
                              <Table.Cell>No Funding Calls</Table.Cell>
                            </BorderedRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <BorderedRow key={fp.id}>
                        <Table.Cell>
                          {fpIndex === 0 ? fagency.name : null}
                        </Table.Cell>
                        <Table.Cell>{fp.name}</Table.Cell>
                        <Table.Cell>No Funding Actions</Table.Cell>
                        <Table.Cell>No Funding Calls</Table.Cell>
                      </BorderedRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <BorderedRow key={fagency.id}>
                  <Table.Cell>{fagency.name}</Table.Cell>
                  <Table.Cell>No Funding Programmes</Table.Cell>
                  <Table.Cell>No Funding Actions</Table.Cell>
                  <Table.Cell>No Funding Calls</Table.Cell>
                </BorderedRow>
              )}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default FundersTable;
