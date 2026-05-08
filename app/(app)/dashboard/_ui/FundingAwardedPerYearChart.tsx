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

const FundingAwardedPerYearChart = ({ perYearData }: Props) => {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-500">
          Funding Trend
        </p>
        <p className="font-semibold text-zinc-950">Total Funding Awarded (€) per Year</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={perYearData}>
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }} stroke="#71717a" tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#71717a" tickLine={false} axisLine={false} />
            <Line
              yAxisId="right"
              dataKey="totalFundingAwarded"
              type="monotone"
              stroke="#18181b"
              strokeWidth={2}
              activeDot={{ r: 6, fill: "#18181b" }}
            />
            <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FundingAwardedPerYearChart;
