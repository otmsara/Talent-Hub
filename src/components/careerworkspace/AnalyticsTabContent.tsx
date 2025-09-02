/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Badge } from "./_ui/badge";
import type { JobPosting } from "../../contexts/SavedJobsContext";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ControlPanel } from "./ControlPanel";
import { InsightsPanel } from "./InsightsPanel";
import { AnalyticsLoading } from "./LoadingAnalyticsTab";
import { Card, CardHeader, CardTitle, CardContent } from "./_ui/card";
import { GrowthRateChart } from "./_charts/GrowthRateChart";
import { SeasonalityChart } from "./_charts/SeasonalityChart";
import { TrendChart } from "./_charts/TrendChart";
import { VolatilityChart } from "./_charts/VolatilityChart";
import { SeasonalityForecastChart } from "./_charts/SeasonalityForecastChart";
import { SeasonalityForecastMAChart } from "./_charts/SeasonalityForecastMAChart";

const DEFAULT_FILTERS = {
  geo: "US",
  ma_window: 20,
  volatility_window: 4,
  smoothing_window: 4,
  anomaly_threshold: 2.0,
};

type AnalyticsDataStructure = {
  dates: string[];
  values: (number | null)[];
  growth_rate?: any;
  trend_data?: any;
  seasonality_data?: any;
  volatility?: any;
  forecast_data?: any;
  moving_average?: any;
  insights?: any;
};

interface AnalyticsTabContentProps {
  selectedJobId: string | null;
  analyticsData: Record<string, AnalyticsDataStructure> | null;
  setAnalyticsData: (data: Record<string, AnalyticsDataStructure>) => void;
  user: any;
  selectedJob: JobPosting | null;
}

export default function AnalyticsTabContent({
  selectedJobId,
  analyticsData,
  setAnalyticsData,
  user,
  selectedJob,
}: AnalyticsTabContentProps) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentAnalyticsData, setCurrentAnalyticsData] = useState<AnalyticsDataStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasCompleteChartData = (data: AnalyticsDataStructure | null): boolean => {
    if (!data) return false;
    return (
      data.growth_rate !== undefined &&
      data.trend_data !== undefined &&
      data.seasonality_data !== undefined &&
      data.volatility !== undefined &&
      data.forecast_data !== undefined
    );
  };

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setError(null);
    console.log("analytics Data:", analyticsData);
    console.log("selected Job Id:", selectedJobId);
    if (analyticsData && selectedJobId) {
      setCurrentAnalyticsData(analyticsData);
      if (!hasCompleteChartData(analyticsData)) {
        setError("Analytics data is incomplete - some charts may not be available");
      }
    } else {
      setCurrentAnalyticsData(null);
      setError(selectedJobId ? "No analytics data available for this job" : "No job selected");
    }
  }, [selectedJobId, analyticsData]);

  const handleApplyFilters = async () => {
    if (!selectedJobId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:9000/v1/analyze",
        {
          skill_or_job: selectedJob?.job_title || selectedJobId,
          geo: filters.geo,
          ma_window: filters.ma_window,
          volatility_window: filters.volatility_window,
          smoothing_window: filters.smoothing_window,
          anomaly_threshold: filters.anomaly_threshold,
        }
      );
      
      const fetchedData = response.data;
      setCurrentAnalyticsData(fetchedData);
      setAnalyticsData((prev) => ({
        ...prev,
        [selectedJobId]: fetchedData,
      }));
      
      if (!hasCompleteChartData(fetchedData)) {
        setError("Received incomplete data - some charts may not be available");
      }
    } catch (error: any) {
      let errorMsg = "An unknown error occurred fetching analytics";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data?.detail) {
          errorMsg = error.response.data.detail;
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      setError(errorMsg);
      setCurrentAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AnalyticsLoading />;
  }

  if (error && !currentAnalyticsData) {
    return (
      <div className="text-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={handleApplyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={!selectedJobId}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentAnalyticsData) {
    return (
      <div className="text-center p-4 text-gray-500">
        No analytics data available. Please select a job and run the analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ControlPanel
        maWindow={filters.ma_window}
        setMaWindow={(value) =>
          setFilters((prev) => ({ ...prev, ma_window: value }))
        }
        volatilityWindow={filters.volatility_window}
        setVolatilityWindow={(value) =>
          setFilters((prev) => ({ ...prev, volatility_window: value }))
        }
        smoothingWindow={filters.smoothing_window}
        setSmoothingWindow={(value) =>
          setFilters((prev) => ({ ...prev, smoothing_window: value }))
        }
        anomalyThreshold={filters.anomaly_threshold}
        setAnomalyThreshold={(value) =>
          setFilters((prev) => ({ ...prev, anomaly_threshold: value }))
        }
        onSearch={handleApplyFilters}
      />

      {error && (
        <div className="text-yellow-500 text-center p-2 bg-yellow-50 rounded">
          {error}
        </div>
      )}

      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader>
          <CardTitle>
            {`Job Market Analytics for ${
              selectedJob?.job_title || selectedJob?.title || selectedJobId
            }`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-200 font-medium">
                {user?.company || "N/A"}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "px-2 py-0.5",
                  user &&
                    (user?.match_score >= 90
                      ? "bg-green-900 text-green-300 border-green-700"
                      : user?.match_score >= 80
                      ? "bg-blue-900 text-blue-300 border-blue-700"
                      : "bg-orange-900 text-orange-300 border-orange-700")
                )}
              >
                {user?.match_score !== undefined
                  ? `${user.match_score.toFixed(1)}% Match`
                  : "N/A"}
              </Badge>
            </div>

            {currentAnalyticsData.insights ? (
              <InsightsPanel
                insights={currentAnalyticsData.insights}
                jobTitle={
                  selectedJob?.job_title ||
                  selectedJob?.title ||
                  selectedJobId
                }
              />
            ) : (
              <p className="text-center text-gray-400 mt-4">
                Insight data unavailable.
              </p>
            )}
          </div>

          {hasCompleteChartData(currentAnalyticsData) ? (
            <div className="mt-8 grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GrowthRateChart
                  data={currentAnalyticsData.growth_rate}
                  jobTitle={
                    selectedJob?.job_title ||
                    selectedJob?.title ||
                    selectedJobId
                  }
                />
                <TrendChart
                  data={currentAnalyticsData.trend_data}
                  movingAverageData={currentAnalyticsData.moving_average}
                  jobTitle={
                    selectedJob?.job_title ||
                    selectedJob?.title ||
                    selectedJobId
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SeasonalityChart
                  data={currentAnalyticsData.seasonality_data}
                  jobTitle={
                    selectedJob?.job_title ||
                    selectedJob?.title ||
                    selectedJobId
                  }
                />
                <VolatilityChart
                  data={currentAnalyticsData.volatility}
                  jobTitle={
                    selectedJob?.job_title ||
                    selectedJob?.title ||
                    selectedJobId
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SeasonalityForecastChart
                  data={currentAnalyticsData.forecast_data}
                  jobTitle={
                    selectedJob?.job_title ||
                    selectedJob?.title ||
                    selectedJobId
                  }
                />
                <SeasonalityForecastMAChart
                  forecast_data={currentAnalyticsData.forecast_data}
                  moving_average_data={currentAnalyticsData.moving_average}
                  jobTitle={
                    selectedJob?.job_title ||
                    selectedJob?.title ||
                    selectedJobId
                  }
                />
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              <p>One or more datasets required for charts are currently unavailable.</p>
              <button 
                onClick={handleApplyFilters}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Try Loading Again
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}