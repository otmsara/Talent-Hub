import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { WorkspaceCard } from './WorkspaceCard';
import { CustomTooltip } from './CustomTooltip';

interface GrowthRateData {
  date: string;
  growthRate: number;
}

interface GrowthRateChartProps {
  data: GrowthRateData[];
  jobTitle?: string;
}

export const GrowthRateChart: React.FC<GrowthRateChartProps> = ({
  data,
  jobTitle = "Data Scientist"
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      date: new Date(item.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value: item.growthRate,
    }));
  }, [data]);

  const yDomain = useMemo(() => {
    const values = chartData.map((d) => d.value).filter((v) => v !== null) as number[];
    if (values.length === 0) return [-5, 5];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const absMax = Math.max(Math.abs(min), Math.abs(max));
    return [
      Math.floor(Math.min(0, min) - absMax * 0.1),
      Math.ceil(Math.max(0, max) + absMax * 0.1),
    ];
  }, [chartData]);

  if (!data || chartData.length === 0) {
    return (
      <WorkspaceCard
        title={`Growth Rate of Interest in ${jobTitle}`}
        className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center"
      >
        <p className="text-gray-500 dark:text-gray-400">
          No growth rate data available for {jobTitle}.
        </p>
      </WorkspaceCard>
    );
  }

  return (
    <WorkspaceCard
      title={`Growth Rate of Interest in ${jobTitle}`}
      className="hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-red-500 dark:text-red-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Growth Rate of Interest
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB dark:#374151" />
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              domain={yDomain}
              label={{
                value: "Growth Rate (%)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#6B7280" },
              }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              allowDataOverflow={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="2 2" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Growth Rate"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
      </div>
    </WorkspaceCard>
  );
};