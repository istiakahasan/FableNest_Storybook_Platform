import React, { useState, useMemo } from "react";

type TimeFrame = "monthly" | "yearly";

interface PieChartProps {
  percentage: number;
  growthTimeFrame: TimeFrame;
  setGrowthTimeFrame: React.Dispatch<React.SetStateAction<TimeFrame>>;
}

const AvgGrowthPieChart: React.FC<PieChartProps> = ({
  percentage = 22,
  growthTimeFrame,
  setGrowthTimeFrame,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownOptions: TimeFrame[] = ["monthly", "yearly"];

  // SVG circle properties
  const size = 300;
  const strokeWidth = 50;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Clamp percentage between 0 and 100 for display
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Calculate stroke dash offset (make sure it doesn't go below 0)
  const strokeDashoffset = useMemo(() => {
    const progress = Math.min(Math.max(percentage, 0), 100) / 100;
    return circumference - progress * circumference;
  }, [percentage, circumference]);

  // Handle percentage over 100% - show special indicator
  const isOver100 = percentage > 100;

  const growth = 5.25;
  const title = "Average";
  const subtitle = "Customer Growth";

  return (
    <div className="bg-white hover:shadow-md transition-all duration-200 rounded-xl px-4 py-5 c-drop-shadow w-full">
      {/* Chart Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 lg:mb-10 gap-6 lg:gap-8">
        {/* Left side - Text */}
        <div className="text-left sm:text-left w-full sm:w-auto">
          <div className="text-gray-900 text-lg sm:text-xl font-normal leading-relaxed">
            {title}
          </div>
          <div className="text-gray-900 text-lg sm:text-xl font-normal leading-relaxed">
            {subtitle}
          </div>
        </div>

        {/* Right side - Pie Chart */}
        <div className="relative shrink-0">
          <svg
            height={size}
            width={size}
            className="transform -rotate-90"
            style={{
              filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))",
            }}>
            {/* Background circle (very light blue/gray) */}
            <circle
              stroke="#E3EEF9"
              fill="white"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />

            {/* Foreground circle - Show differently for over 100% */}
            {isOver100 ? (
              // For over 100%, show full circle with special color
              <circle
                stroke="#10B981" // Emerald green for over-achievement
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0} // Full circle
                strokeLinecap="butt"
                r={radius}
                cx={size / 2}
                cy={size / 2}
              />
            ) : (
              // Normal blue circle for 0-100%
              <circle
                stroke="#6AABF0"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="butt"
                r={radius}
                cx={size / 2}
                cy={size / 2}
              />
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-2xl font-semibold ${
                isOver100 ? "text-emerald-600" : "text-gray-900"
              }`}>
              {isOver100 ? "100+" : `${clampedPercentage}%`}
            </span>
            {isOver100 && (
              <span className="text-xs text-emerald-600 font-medium mt-1">
                +{percentage - 100}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Dropdown and Growth */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        {/* Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#0556AB] text-white px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 hover:bg-[#0556AB]/90 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            style={{ minWidth: "120px" }}>
            {growthTimeFrame === "monthly" ? "Monthly" : "Yearly"}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden w-full sm:w-auto"
              style={{ minWidth: "120px" }}>
              {dropdownOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setGrowthTimeFrame(option);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors whitespace-nowrap">
                  {option === "monthly" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Growth Indicator */}
        <div
          className={`border-2 rounded-full px-4 py-2 flex items-center w-full sm:w-auto justify-center sm:justify-start ${
            isOver100
              ? "bg-emerald-50 border-emerald-400"
              : "bg-green-50 border-green-400"
          }`}>
          <span
            className={`text-sm font-semibold ${
              isOver100 ? "text-emerald-600" : "text-green-600"
            }`}>
            ▲ {isOver100 ? `${growth.toFixed(2)}+` : `${growth.toFixed(2)}`}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvgGrowthPieChart;
