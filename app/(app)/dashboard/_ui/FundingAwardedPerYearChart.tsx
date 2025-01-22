"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
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
      <CardHeader>
        <p className="font-bold">Total Funding Awarded (€) per Year</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={perYearData}>
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }} />
            <YAxis yAxisId="right" orientation="right" />
            <Line
              yAxisId="right"
              dataKey="totalFundingAwarded"
              type="monotone"
              stroke="orange"
              activeDot={{ r: 10 }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default FundingAwardedPerYearChart;
