import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type TimeFrame = "1year" | "6months";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    payload: any;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;

    return (
      <div className="bg-gray-800 text-white text-xs py-2 px-3 rounded shadow-lg">
        <div className="font-medium mb-1">{data?.originalLabel || label}</div>
        <div className="whitespace-nowrap mb-1">
          Generated: ${(data?.generated || 0).toFixed(2)}
        </div>
        <div className="whitespace-nowrap">
          Customized: ${(data?.customized || 0).toFixed(2)}
        </div>
        <div className="mt-1 pt-1 border-t border-gray-700 font-semibold">
          Total: $
          {((data?.generated || 0) + (data?.customized || 0)).toFixed(2)}
        </div>
      </div>
    );
  }
  return null;
};

interface RevProps {
  data: any[] | undefined;
  periodTimeFrame: TimeFrame;
  setPeriodTimeFrame: React.Dispatch<React.SetStateAction<TimeFrame>>;
}

const RevenueStatsChart = ({
  data,
  periodTimeFrame,
  setPeriodTimeFrame,
}: RevProps) => {
  const handlePrevious = () => {
    setPeriodTimeFrame((prev) => (prev === "1year" ? "6months" : "1year"));
  };

  const handleNext = () => {
    setPeriodTimeFrame((prev) => (prev === "1year" ? "6months" : "1year"));
  };

  // Process data for chart
  const chartData = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }

    // Fallback empty data with proper month names
    const monthCount = periodTimeFrame === "1year" ? 12 : 6;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Start from current month and go backward
    const currentDate = new Date();
    const result = [];

    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);

      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const year = date.getFullYear();

      result.push({
        day: monthName,
        generated: 0,
        customized: 0,
        originalLabel: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
      });
    }

    return result;
  }, [data, periodTimeFrame]);

  // Calculate max value for YAxis (for proper scaling)
  const maxValue = useMemo(() => {
    if (!chartData || chartData.length === 0) return 50; // Default max

    const allValues = chartData.flatMap((item) => [
      item.generated || 0,
      item.customized || 0,
      item.revenue || 0,
    ]);

    const max = Math.max(...allValues);

    if (max === 0) return 50; // Default when all zeros

    // Add some padding (20%) and round up to nearest nice number
    const padded = max * 1.2;

    // Nice rounding for better Y-axis ticks
    if (padded < 10) return 10;
    if (padded < 50) return 50;
    if (padded < 100) return 100;
    if (padded < 500) return 500;
    if (padded < 1000) return 1000;

    return Math.ceil(padded / 100) * 100;
  }, [chartData]);

  return (
    <div className="bg-white hover:shadow-md transition-all duration-200 rounded-xl px-4 py-5 c-drop-shadow w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
        {/* Title and Time Frame Selector Row */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-start gap-3 sm:gap-4 w-full lg:w-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 whitespace-nowrap">
            Revenue Stats
          </h2>

          {/* Time Frame Selector */}
          <div className="flex items-center bg-[#0556AB] overflow-hidden w-auto xs:w-auto rounded">
            <button
              className="px-3 py-2 sm:py-3 text-white hover:bg-blue-600/20 transition-all duration-200 flex items-center"
              onClick={handlePrevious}
              aria-label="Previous period">
              <ChevronLeft
                size={18}
                strokeWidth={2.5}
                className="sm:w-5 sm:h-5"
              />
            </button>

            <div className="px-4 py-2 sm:py-3 text-white font-semibold text-xs sm:text-sm tracking-wide border-x border-white/10 bg-[#0556AB] min-w-[120px] text-center">
              <span className="inline-block">
                {periodTimeFrame === "1year" ? "1 Year" : "6 Months"}
              </span>
            </div>

            <button
              className="px-3 py-2 sm:py-3 text-white hover:bg-blue-600/20 transition-all duration-200 flex items-center"
              onClick={handleNext}
              aria-label="Next period">
              <ChevronRight
                size={18}
                strokeWidth={2.5}
                className="sm:w-5 sm:h-5"
              />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between sm:justify-start mt-2 sm:mt-0 lg:mt-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#73B7FF]"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Customized
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E2E8F0]"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Generated
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container - FIXED VERSION */}
      <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 10,
            }}
            barGap={8}
            barCategoryGap="15%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 11,
                fontWeight: 500,
              }}
              interval={0}
              minTickGap={1}
            />
            <YAxis
              // IMPORTANT FIX: Remove scale="log" and domain=[1000, "auto"]
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 11,
                fontWeight: 500,
              }}
              width={50}
              // Format as currency without decimals for small amounts
              tickFormatter={(value) => `$${value.toFixed(value < 10 ? 2 : 0)}`}
              // Set proper domain for small values
              domain={[0, maxValue]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(5, 86, 171, 0.05)" }}
            />
            {/* Generated Bar - Gray */}
            <Bar
              dataKey="generated"
              name="Generated"
              fill="#E2E8F0"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              // Ensure bars show even for small values
              minPointSize={3}
            />
            {/* Customized Bar - Blue */}
            <Bar
              dataKey="customized"
              name="Customized"
              fill="#73B7FF"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              minPointSize={3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex sm:hidden justify-center gap-2 mt-6">
        {(["1year", "6months"] as TimeFrame[]).map((item) => (
          <button
            key={item}
            className={`w-2 h-2 rounded-full transition-all ${
              periodTimeFrame === item
                ? "bg-[#0556AB] scale-125"
                : "bg-gray-300"
            }`}
            onClick={() => setPeriodTimeFrame(item)}
            aria-label={`View ${item} data`}
          />
        ))}
      </div>
    </div>
  );
};

export default RevenueStatsChart;
