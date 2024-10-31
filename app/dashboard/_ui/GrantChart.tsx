"use client";

import { Card } from "@radix-ui/themes";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from "recharts";

interface Props {
  awaiting: number;
  submitted: number;
  awarded: number;
  rejected: number;
}

const GrantChart = ({ awaiting, submitted, awarded, rejected }: Props) => {
  const data = [
    { label: "Submitted", value: submitted },
    { label: "Awaiting", value: awaiting },
    { label: "Awarded", value: awarded },
    { label: "Rejected", value: rejected },
  ];
  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          {/* If the Tooltip is below the Bar, tooltip will mask the bar */}
          <Tooltip />
          <Bar
            dataKey="value"
            barSize={60}
            // style={{ fill: "var(--accent-9)" }}
            fill="var(--accent-9)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default GrantChart;
