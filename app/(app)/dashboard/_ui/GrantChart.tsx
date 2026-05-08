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
      <CardHeader className="space-y-2 pb-2">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-500">
          Status Mix
        </p>
        <p className="text-lg font-semibold text-zinc-950"># Grants per Status</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#71717a" tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              barSize={60}
              fill="#18181b"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GrantChart;
