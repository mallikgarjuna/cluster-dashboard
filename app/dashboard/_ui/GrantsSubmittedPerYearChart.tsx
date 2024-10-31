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
  perYearData: { year: number | null; submitted: number }[];
}

const GrantsSubmittedPerYearChart = ({ perYearData }: Props) => {
  // const perYearData = [
  //   { year: 2023, submitted: 20 },
  //   { year: 2024, submitted: 10 },
  // ];

  return (
    <Card>
      <CardHeader>Grants Submitted per Year</CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={perYearData}>
            <XAxis dataKey="year" padding={{ left: 20, right: 20 }} />
            <YAxis />
            <Line
              dataKey="submitted"
              type="monotone"
              stroke="blue"
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

export default GrantsSubmittedPerYearChart;
