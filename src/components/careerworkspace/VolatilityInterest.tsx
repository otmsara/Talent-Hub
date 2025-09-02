import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import { WorkspaceCard } from "./WorkspaceCard";
import CustomTooltip from "./CustomTooltip";

interface GrowthRateData {
  date: string;
  growthRate: number;
}

const CustomizedAxisTick = ({ x, y, payload }: any) => {
  const date = new Date(payload.value);
  const year = date.getFullYear();

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#9CA3AF" fontSize={12}>
        {year}
      </text>
    </g>
  );
};

interface GrowthRateChartProps {
  data: GrowthRateData[];
  jobTitle?: string;
}

const GrowthRateChart = ({ data, jobTitle = "data scientist" }: GrowthRateChartProps) => {
  const growthRates = data.map((item) => item.growthRate).filter((rate) => rate !== null);
  const minRate = Math.floor(Math.min(...growthRates));
  const maxRate = Math.ceil(Math.max(...growthRates));

  const yMin = Math.floor(minRate / 5) * 5;
  const yMax = Math.ceil(maxRate / 5) * 5;

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceCard
        title={`Growth Rate of Interest in ${jobTitle}`}
        className="hover:border-workspace-accent transition-all duration-200 bg-gray-800 border-gray-700"
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tick={<CustomizedAxisTick />}
              stroke="#9CA3AF"
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />
            <YAxis
              domain={[yMin, yMax]}
              tickFormatter={(value) => `${value}`}
              stroke="#9CA3AF"
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
              ticks={[-150, -100, -50, 0, 50, 100]}
              label={{
                value: "Growth Rate (%)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#9CA3AF", fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#6B7280" />
            <Legend
              formatter={() => <span className="text-gray-300">Date</span>}
              wrapperStyle={{ paddingTop: "10px" }}
            />
            <Line
              type="natural"
              dataKey="growthRate"
              name="Growth Rate"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#1F2937" }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </WorkspaceCard>
    </div>
  );
};

export default GrowthRateChart;