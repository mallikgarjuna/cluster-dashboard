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
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Status Mix
        </p>
        <p className="font-display text-lg font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
          # Grants per Status
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#6B6B6B" tickLine={false} axisLine={false} />
            <YAxis stroke="#6B6B6B" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              barSize={60}
              fill="#6366F1"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GrantChart;
