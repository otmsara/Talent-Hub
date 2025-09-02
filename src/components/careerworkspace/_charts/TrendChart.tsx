
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
// import { TimeseriesData } from '../../types/api'; // Import the new data type

interface LocalTimeseriesData {
  dates: string[];
  values: (number | null)[];
}

interface TrendChartProps {
  data?: LocalTimeseriesData; // Data is now LocalTimeseriesData and optional
  jobTitle: string; 
  // Assuming moving average data will be passed separately or handled within AnalyzeJobSkillResponse if it's part of the same dataset
  movingAverageData?: LocalTimeseriesData; // Optional prop for moving average
}

export const TrendChart = ({ data, jobTitle, movingAverageData }: TrendChartProps) => {
  const chartData = useMemo(() => {
  if (!data?.dates || !data?.values) return [];

  return data.dates.map((date, index) => {
    const timestamp = new Date(date).getTime(); // Use timestamp for time series
    const entry: {
      date: number;
      trendValue: number | null;
      movingAverageValue?: number | null;
    } = {
      date: timestamp,
      trendValue: data.values[index],
    };

    if (movingAverageData?.dates && movingAverageData?.values) {
      const maIndex = movingAverageData.dates.indexOf(date);
      if (maIndex !== -1) {
        entry.movingAverageValue = movingAverageData.values[maIndex];
      }
    }

    return entry;
  });
}, [data, movingAverageData]);


  if (!data || chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-400">No trend data available for {jobTitle}.</p>
      </div>
    );
  }
  
  // Determine Y-axis domain dynamically or use fixed values
  const yDomain = useMemo(() => {
    const allValues = chartData.flatMap(item => 
      [item.trendValue, item.movingAverageValue].filter(v => v !== null && v !== undefined) as number[]
    );
    if (allValues.length === 0) return [0, 100]; // Default domain
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    return [Math.floor(minVal * 0.95), Math.ceil(maxVal * 1.05)]; // Add some padding
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
        <TrendingUp className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold">Trend with Moving Average</h3>
      </div>
      
      <h4 className="text-md mb-4 text-gray-300">
        Trend Over Time with Moving Average ({jobTitle})
      </h4>
      
      <div className="h-64"> {/* Ensure this has a defined height */}
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
              allowDataOverflow={false}
            />
            <Tooltip
              labelFormatter={(value) =>
              new Date(value).toLocaleDateString(undefined, {  month: 'short', day: 'numeric' })
              }
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#9CA3AF' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />

            <Legend />
            <Line 
              type="monotone" 
              dataKey="trendValue" // Updated dataKey
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Trend" // Updated name
              dot={false}
            />
            {movingAverageData && ( // Conditionally render MA line
              <Line 
                type="monotone" 
                dataKey="movingAverageValue" // Updated dataKey for MA
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Moving Average" // Updated name
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
