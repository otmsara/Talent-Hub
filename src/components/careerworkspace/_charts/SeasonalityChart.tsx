
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar } from 'lucide-react';
// import { SeasonalityData as ApiSeasonalityData } from '../../types/api'; // Renamed to avoid conflict

interface LocalSeasonalityData {
  months: string[];
  values: (number | null)[];
}

interface SeasonalityChartProps {
  data?: LocalSeasonalityData; // Data is now LocalSeasonalityData and optional
  jobTitle: string; 
}

// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const SeasonalityChart = ({ data, jobTitle }: SeasonalityChartProps) => {
  const chartData = useMemo(() => {
    if (!data?.months || !data?.values) return [];
    // Assuming data.months are already short month names e.g. "Jan", "Feb"
    return data.months.map((monthName, index) => ({
      monthName: monthName, 
      value: data.values[index],
    }));
  }, [data]);

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-400">No seasonality data available for {jobTitle}.</p>
      </div>
    );
  }
  
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const values = chartData.map(item => item.value).filter(v => v !== null) as number[];
    if (values.length === 0) return [0, 100];
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    return [Math.floor(minVal * 0.9), Math.ceil(maxVal * 1.1)];
  }, [chartData]);


  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold">Seasonality Index</h3>
      </div>
      
      <h4 className="text-md mb-4 text-gray-300">
        Seasonality Index ({jobTitle})
      </h4>
      
      <div className="h-64"> {/* Ensure this has a defined height */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="monthName" // Updated dataKey
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={yDomain}
              label={{ value: 'Average Interest', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              allowDataOverflow={false}
            />
            <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#9CA3AF' }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="value" // Updated dataKey
              fill="#6366F1"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">Month</span>
      </div>
    </div>
  );
};
