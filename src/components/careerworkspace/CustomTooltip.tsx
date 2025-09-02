import React from 'react';
import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  // You can extend with any additional props if needed
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-gray-900/90 border border-gray-700 rounded-md p-3 shadow-lg text-white backdrop-blur-sm">
      <p className="font-medium mb-1">
        {label ? new Date(label).toLocaleDateString("default", { 
          month: "short", 
          year: "numeric"
        }) : 'No date'}
      </p>
      {payload.map((entry, index) => {
        const value = entry.value;
        const displayValue = value !== null && value !== undefined 
          ? `${value.toFixed(2)}%` 
          : "N/A";

        return (
          <p 
            key={`tooltip-item-${index}`} 
            className="text-sm flex items-center gap-2"
            style={{ color: entry.color || 'inherit' }}
          >
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color || 'transparent' }} 
            />
            <span>
              {entry.name || 'Unknown'}: {displayValue}
            </span>
          </p>
        );
      })}
    </div>
  );
};

export default CustomTooltip;