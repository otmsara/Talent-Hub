import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface LocalForecastResponse {
  dates: string[];
  values: (number | null)[];
}

interface LocalTimeseriesData {
  dates: string[];
  values: (number | null)[];
}

interface SeasonalityForecastMAChartProps {
  forecast_data?: LocalForecastResponse;
  moving_average_data?: LocalTimeseriesData;
  jobTitle: string;
}

export const SeasonalityForecastMAChart = ({
  forecast_data,
  moving_average_data,
  jobTitle,
}: SeasonalityForecastMAChartProps) => {
  const chartData = useMemo(() => {
    if (
      !forecast_data?.dates ||
      !forecast_data.values ||
      !moving_average_data?.dates ||
      !moving_average_data.values
    ) {
      return [];
    }

    const combinedData: { date: number; forecastValue: number | null; movingAverageValue: number | null }[] = [];
    const allDates = new Set([...forecast_data.dates, ...moving_average_data.dates]);
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    sortedDates.forEach((dateStr) => {
      const forecastIndex = forecast_data.dates.indexOf(dateStr);
      const maIndex = moving_average_data.dates.indexOf(dateStr);

      combinedData.push({
        date: new Date(dateStr).getTime(), // Convert to timestamp
        forecastValue: forecastIndex !== -1 ? forecast_data.values[forecastIndex] : null,
        movingAverageValue: maIndex !== -1 ? moving_average_data.values[maIndex] : null,
      });
    });

    return combinedData;
  }, [forecast_data, moving_average_data]);

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-400">No forecast or moving average data available for {jobTitle}.</p>
      </div>
    );
  }

  const yDomain = useMemo(() => {
    const allValues = chartData.flatMap((item) =>
      [item.forecastValue, item.movingAverageValue].filter((v) => v !== null) as number[]
    );
    if (allValues.length === 0) return [0, 100];
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    return [Math.floor(minVal * 0.95), Math.ceil(maxVal * 1.05)];
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
        <TrendingUp className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold">Seasonality Trend with Forecast and MA</h3>
      </div>

      <h4 className="text-md mb-4 text-gray-300">
        Seasonality Trend with Forecast and Moving Average ({jobTitle})
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
                value: 'Interest',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#9CA3AF' },
              }}
              allowDataOverflow={false}
            />
            <Tooltip
              labelFormatter={(timestamp) =>
                new Date(timestamp).toLocaleDateString(undefined, {
                  
                  month: 'short',
                  day: 'numeric',
                })
              }
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#9CA3AF' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="forecastValue"
              stroke="#06B6D4"
              strokeWidth={2}
              name="Forecast"
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="movingAverageValue"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Moving Average"
              dot={false}
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
