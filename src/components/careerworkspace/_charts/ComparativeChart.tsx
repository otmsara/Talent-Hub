
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
// import { CompareJobSkillsResponse } from '../../types/api'; // Import new type

interface LocalCompareJobSkillsResponse {
  // Define a minimal structure based on its usage, or leave it very generic
  comparison?: any;
}

interface ComparativeChartProps {
  data?: LocalCompareJobSkillsResponse; // Data is now LocalCompareJobSkillsResponse and optional
  jobTitles?: string[]; // Should match keys in data.comparison
}

// Define a list of distinct colors for the lines
const lineColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#6366F1"];

export const ComparativeChart = ({ data, jobTitles }: ComparativeChartProps) => {
  const chartData = useMemo(() => {
    if (!data?.comparison || !jobTitles?.length) return [];

    const allDates = new Set<string>();
    jobTitles.forEach(title => {
      const skillData = data.comparison[title]?.trend_data;
      skillData?.dates.forEach(d => allDates.add(d));
    });
    const sortedDates = Array.from(allDates).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedDates.map(dateStr => {
      const entry: { date: string; [key: string]: string | number | null } = { 
        date: new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
      };
      jobTitles.forEach(title => {
        const skillData = data.comparison[title]?.trend_data;
        if (skillData) {
          const dateIndex = skillData.dates.indexOf(dateStr);
          entry[title] = dateIndex !== -1 ? skillData.values[dateIndex] : null;
        } else {
          entry[title] = null;
        }
      });
      return entry;
    });
  }, [data, jobTitles]);

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-400">No comparative data available.</p>
      </div>
    );
  }
  
  const yDomain = useMemo(() => {
    if (chartData.length === 0 || !jobTitles) return [0, 100];
    const allValues = chartData.flatMap(item => 
        jobTitles.map(title => item[title] as number)
    ).filter(v => v !== null && v !== undefined);

    if (allValues.length === 0) return [0, 100];
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    return [Math.floor(minVal * 0.95), Math.ceil(maxVal * 1.05)];
  }, [chartData, jobTitles]);


  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold">Comparative Trends for Jobs/Skills</h3>
      </div>
      
      <h4 className="text-md mb-4 text-gray-300">
        Comparative Trends for {jobTitles?.join(' vs ') || 'N/A'}
      </h4>
      
      <div className="h-80"> {/* Ensure this has a defined height */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={yDomain}
              label={{ value: 'Interest', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              allowDataOverflow={false}
            />
            <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#9CA3AF' }}
                labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Legend />
            {jobTitles?.map((title, index) => (
              <Line 
                key={title}
                type="monotone" 
                dataKey={title} // dataKey is the job title itself
                stroke={lineColors[index % lineColors.length]} // Cycle through predefined colors
                strokeWidth={2}
                name={title}
                dot= {false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">Date</span>
      </div>
    </div>
  );
};
