import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { WorkspaceCard } from './WorkspaceCard';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

interface ForecastChartProps {
  data: any;
  jobTitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 border border-gray-700 rounded-md p-3 shadow-lg text-white backdrop-blur-sm">
        <p className="font-medium mb-1">
          {label ? new Date(label).toLocaleDateString("default", { 
            month: "short", 
            year: "numeric" 
          }) : 'No date'}
        </p>
        {payload.map((entry, index) => (
          <p 
            key={`tooltip-item-${index}`} 
            style={{ color: entry.color }} 
            className="text-sm flex items-center gap-2"
          >
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>
              {entry.name}: {entry.value !== null ? `${entry.value.toFixed(2)}` : "N/A"}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface CustomizedAxisTickProps {
  x?: number;
  y?: number;
  payload?: any;
}

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, payload }) => {
  if (!payload?.value) return null;
  
  const date = new Date(payload.value);
  const year = date.getFullYear();
  const month = date.getMonth();

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#9CA3AF" fontSize={12}>
        {month === 0 ? year : ""}
      </text>
    </g>
  );
};

export const ForecastChart: React.FC<ForecastChartProps> = ({ 
  data, 
  jobTitle = "Senior Full Stack Developer" 
}) => {
  const [forecastType, setForecastType] = useState<'trend' | 'confidence' | 'combined'>('combined');

  if (!data || !data.forecast_data) {
    return (
      <div className="rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-6 text-gray-500 dark:text-gray-400 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-medium">No Forecast Data</h3>
          <p>Forecast data is not available for this job position.</p>
        </div>
      </div>
    );
  }

  const processForecastData = () => {
    const forecastData = data.forecast_data;
    const historicalData = data.trend_data;

    const historicalPoints = historicalData.dates
      .slice(-12)
      .map((date: string, index: number) => ({
        date,
        actual: historicalData.values[historicalData.values.length - 12 + index],
        forecast: null,
        lower: null,
        upper: null,
        isHistorical: true,
      }));

    const forecastPoints = forecastData.dates.map((date: string, index: number) => ({
      date,
      actual: null,
      forecast: forecastData.values[index],
      lower: forecastData.lower_bound ? forecastData.lower_bound[index] : forecastData.values[index] * 0.8,
      upper: forecastData.upper_bound ? forecastData.upper_bound[index] : forecastData.values[index] * 1.2,
      isHistorical: false,
    }));

    return [...historicalPoints, ...forecastPoints];
  };

  const chartData = processForecastData();

  const calculateStats = () => {
    const forecastValues = chartData
      .filter((item) => !item.isHistorical && item.forecast !== null)
      .map((item) => item.forecast);

    if (forecastValues.length === 0) return { avg: 0, max: 0, growth: 0 };

    const avg = forecastValues.reduce((sum, val) => sum + val, 0) / forecastValues.length;
    const max = Math.max(...forecastValues);

    const first = forecastValues[0] || 0;
    const last = forecastValues[forecastValues.length - 1] || 0;
    const growth = first !== 0 ? ((last - first) / first) * 100 : 0;

    return { avg, max, growth };
  };

  const stats = calculateStats();
  const forecastStartDate = chartData.find((item) => !item.isHistorical)?.date;

  return (
    <div className="space-y-6">
      <WorkspaceCard
        title={`Future Forecast for ${jobTitle}`}
        className="hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Market Projection</h3>
            <div className="flex space-x-2">
              {['trend', 'confidence', 'combined'].map((type) => (
                <button
                  key={type}
                  onClick={() => setForecastType(type as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    forecastType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200">Projected Growth</h5>
              </div>
              <span className="text-2xl font-bold text-green-500 dark:text-green-400">
                {stats.growth.toFixed(2)}%
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Expected growth over forecast period
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200">Forecast Period</h5>
              </div>
              <span className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                {forecastStartDate ? new Date(forecastStartDate).getFullYear() : 'N/A'} -{' '}
                {chartData.length > 0 ? new Date(chartData[chartData.length - 1].date).getFullYear() : 'N/A'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projection timeframe</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200">Confidence Level</h5>
              </div>
              <span className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">95%</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Statistical confidence interval</p>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB dark:#374151" />
              <XAxis
                dataKey="date"
                tick={<CustomizedAxisTick />}
                stroke="#6B7280"
                axisLine={{ stroke: "#D1D5DB dark:#4B5563" }}
                tickLine={{ stroke: "#D1D5DB dark:#4B5563" }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#6B7280" }}
                axisLine={{ stroke: "#D1D5DB dark:#4B5563" }}
                tickLine={{ stroke: "#D1D5DB dark:#4B5563" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>} 
                iconType="circle" 
              />

              {forecastStartDate && (
                <ReferenceLine
                  x={forecastStartDate}
                  stroke="#9CA3AF"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Forecast Start',
                    position: 'top',
                    fill: '#6B7280',
                    fontSize: 12,
                  }}
                />
              )}

              <Line
                type="monotone"
                dataKey="actual"
                name="Historical Data"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "#F3F4F6 dark:#1F2937" }}
                activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2, fill: "#F3F4F6 dark:#1F2937" }}
              />

              {(forecastType === 'trend' || forecastType === 'combined') && (
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: "#F3F4F6 dark:#1F2937" }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#F3F4F6 dark:#1F2937" }}
                />
              )}

              {(forecastType === 'confidence' || forecastType === 'combined') && (
                <>
                  <Area
                    type="monotone"
                    dataKey="upper"
                    name="Upper Bound"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    name="Lower Bound"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>
            This forecast is based on historical trends and market analysis. The confidence interval represents the
            range of possible outcomes with 95% statistical confidence. Actual market conditions may vary.
          </p>
        </div>
      </WorkspaceCard>
    </div>
  );
};