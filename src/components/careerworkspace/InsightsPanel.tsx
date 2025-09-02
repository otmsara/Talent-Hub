import React from 'react';

interface Insights {
  trend_status_5y?: string;
  average_trend_5y?: number;
  average_trend_3m?: number;
  growth_rate_5y?: number;
  growth_rate_3m?: number;
  peak_value?: number;
  low_value?: number;
  trend_variability_5y?: number;
}

interface InsightsPanelProps {
  jobTitle?: string;
  insights?: Insights;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  jobTitle, 
  insights 
}) => {
  // Helper to format numbers to 2 decimal places
  const formatNum = (num: number | undefined) => num?.toFixed(2) ?? 'N/A';
  
  // Helper to determine text color based on value (positive/negative)
  const getValueColor = (value: number | undefined) => {
    if (value === undefined) return 'text-gray-800 dark:text-white';
    return value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  if (!insights) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Insights</h2>
        <p className="text-gray-500 dark:text-gray-400">
          No insights data available for {jobTitle || "the selected skill"}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Insights for {jobTitle}
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Key Metrics:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Trend Status (5Y):</span>
              <span className={
                insights.trend_status_5y === "Trending Up" ? 'text-green-600 dark:text-green-400' :
                insights.trend_status_5y === "Trending Down" ? 'text-red-600 dark:text-red-400' :
                'text-gray-800 dark:text-white'
              }>
                {insights.trend_status_5y ?? 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Trend (5Y):</span>
              <span className="text-gray-800 dark:text-white">{formatNum(insights.average_trend_5y)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Trend (3M):</span>
              <span className="text-gray-800 dark:text-white">{formatNum(insights.average_trend_3m)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Growth Rate (5Y):</span>
              <span className={getValueColor(insights.growth_rate_5y)}>
                {formatNum(insights.growth_rate_5y)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Growth Rate (3M):</span>
              <span className={getValueColor(insights.growth_rate_3m)}>
                {formatNum(insights.growth_rate_3m)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Peak Value:</span>
              <span className="text-gray-800 dark:text-white">{formatNum(insights.peak_value)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Low Value:</span>
              <span className="text-gray-800 dark:text-white">{formatNum(insights.low_value)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Trend Variability (5Y):</span>
              <span className="text-gray-800 dark:text-white">{formatNum(insights.trend_variability_5y)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};