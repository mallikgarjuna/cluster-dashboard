"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  perYearData: {
    year: number | null;
    submitted: number;
    awarded: number;
    totalFundingAwarded: number;
  }[];
}

const GrantsSubmittedPerYearChart = ({ perYearData }: Props) => {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Submission Trend
        </p>
        <p className="font-display font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
          # Grants Submitted/Awarded per Year
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={perYearData}>
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }} stroke="#6B6B6B" tickLine={false} axisLine={false} />
            <YAxis stroke="#6B6B6B" tickLine={false} axisLine={false} />
            <Line
              dataKey="submitted"
              type="monotone"
              stroke="#6366F1"
              strokeWidth={2}
              activeDot={{ r: 6, fill: "#6366F1" }}
            />
            <Line
              dataKey="awarded"
              type="monotone"
              stroke="#10B981"
              strokeWidth={2}
              activeDot={{ r: 6, fill: "#10B981" }}
            />
            <CartesianGrid stroke="#E8E8EC" strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GrantsSubmittedPerYearChart;
