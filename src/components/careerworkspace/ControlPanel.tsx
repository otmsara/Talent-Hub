import React from 'react';
import { Input } from "./_ui/input";
import { Label } from "./_ui/label";
import { Button } from "./_ui/button";

interface ControlPanelProps {
  maWindow: number;
  setMaWindow: (value: number) => void;
  volatilityWindow: number;
  setVolatilityWindow: (value: number) => void;
  smoothingWindow: number;
  setSmoothingWindow: (value: number) => void;
  anomalyThreshold: number;
  setAnomalyThreshold: (value: number) => void;
  onSearch: () => void;
}

export const ControlPanel = ({
  maWindow,
  setMaWindow,
  volatilityWindow,
  setVolatilityWindow,
  smoothingWindow,
  setSmoothingWindow,
  anomalyThreshold,
  setAnomalyThreshold,
  onSearch
}: ControlPanelProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {/* MA Window Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="maWindow" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            MA Window (weeks)
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{maWindow}</span>
        </div>
        <Input
          id="maWindow"
          type="range"
          min="2"
          max="52"
          value={maWindow}
          onChange={(e) => setMaWindow(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-400 dark:accent-[rgb(76,201,240)]"
        />
      </div>

      {/* Volatility Window Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="volatilityWindow" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Volatility Window (weeks)
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{volatilityWindow}</span>
        </div>
        <Input
          id="volatilityWindow"
          type="range"
          min="2"
          max="52"
          value={volatilityWindow}
          onChange={(e) => setVolatilityWindow(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-400 dark:accent-[rgb(76,201,240)]"
        />
      </div>

      {/* Smoothing Window Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="smoothingWindow" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Smoothing Window (weeks)
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{smoothingWindow}</span>
        </div>
        <Input
          id="smoothingWindow"
          type="range"
          min="2"
          max="52"
          value={smoothingWindow}
          onChange={(e) => setSmoothingWindow(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-400 dark:accent-[rgb(76,201,240)]"
        />
      </div>

      {/* Anomaly Threshold Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="anomalyThreshold" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Anomaly Threshold
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{anomalyThreshold.toFixed(1)}</span>
        </div>
        <Input
          id="anomalyThreshold"
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={anomalyThreshold}
          onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-400 dark:accent-[rgb(76,201,240)]"
        />
      </div>

      {/* Search Button */}
      <div className="md:col-span-2 flex justify-center">
        <Button 
          onClick={onSearch}
          className="mt-4 w-full md:w-auto bg-blue-500 hover:bg-blue-600 dark:bg-[rgb(76,201,240)] dark:hover:bg-[rgb(76,201,240)]/90 text-white dark:text-black transition-colors"
        >
          Apply Filters & Search
        </Button>
      </div>
    </div>
  );
};