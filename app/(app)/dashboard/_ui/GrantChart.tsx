"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
      <CardHeader>
        <p className="text-lg font-bold"># Grants per Status</p>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default GrantChart;
