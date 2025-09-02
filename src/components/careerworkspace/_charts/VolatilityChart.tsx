import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

interface LocalTimeseriesData {
  dates: string[];
  values: (number | null)[];
}

interface VolatilityChartProps {
  data?: LocalTimeseriesData;
  jobTitle: string;
}

export const VolatilityChart = ({ data, jobTitle }: VolatilityChartProps) => {
  const chartData = useMemo(() => {
    if (!data?.dates || !data?.values) return [];
    return data.dates.map((date, index) => ({
      date: new Date(date).getTime(), // Store as timestamp
      value: data.values[index],
    }));
  }, [data]);

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-400">No volatility data available for {jobTitle}.</p>
      </div>
    );
  }

  const yDomain = useMemo(() => {
    const values = chartData.map(item => item.value).filter(v => v !== null) as number[];
    if (values.length === 0) return [0, 1];
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    return [Math.max(0, Math.floor(minVal * 0.9)), Math.ceil(maxVal * 1.1)];
  }, [chartData]);
   const xTicks = useMemo(() => {
  const years = new Set<number>();
  chartData.forEach(d => {
    const year = new Date(d.date).getFullYear();
    years.add(new Date(`${year}`).getTime());
  });
  return Array.from(years).sort();
}, [chartData]);



  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold">Volatility of Interest</h3>
      </div>

      <h4 className="text-md mb-4 text-gray-300">
        Volatility of Interest in {jobTitle}
      </h4>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={['auto', 'auto']}
              ticks={xTicks}
              tickFormatter={(timestamp) => new Date(timestamp).getFullYear().toString()}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              domain={yDomain}
              label={{
                value: 'Volatility Score',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#9CA3AF' },
              }}
              allowDataOverflow={false}
            />
            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, {  month: 'short', day: 'numeric' })
              }
              contentStyle={{ backgroundColor: '#1F2937', border: '0.5px solid #374151', borderRadius: '0.1rem' }}
              itemStyle={{ color: '#9CA3AF' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              name="Volatility"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">Date</span>
      </div>
    </div>
  );
};
