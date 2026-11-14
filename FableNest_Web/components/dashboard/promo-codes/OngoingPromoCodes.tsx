// components/OngoingPromoCodes.tsx
import React from "react";
import { getExpirationStatus } from "@/utils/timeUtils";
import { PromoCodeTypes } from "@/types/dashboard2Types";

interface OngoingPromoCodesProps {
  promos: PromoCodeTypes[];
  onEdit?: (id: string) => void;
  onStop?: (id: string) => void;
  isLoading?: boolean;
  showSkeleton?: boolean;
}

const OngoingPromoCodes: React.FC<OngoingPromoCodesProps> = ({
  promos,
  onEdit,
  onStop,
  isLoading = false,
  showSkeleton = false,
}) => {
  // Get time status for a promo
  const getTimeStatus = (promo: PromoCodeTypes) => {
    if (!promo.startTime || !promo.endTime) return "Active";

    const status = getExpirationStatus(
      promo.isActive,
      promo.startTime,
      promo.endTime
    );
    return status.timeText;
  };

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 sm:h-56 md:h-60 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (promos.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-gray-200">
        <div className="mb-3 sm:mb-4">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 4C8.3 4 2 10.3 2 18s6.3 14 14 14 14-6.3 14-14S23.7 4 16 4zm0 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H12v-2h2v-4h-2v-2h4v6h2v2z"
            />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
          No ongoing promo codes
        </h3>
        <p className="text-sm sm:text-base text-gray-500 max-w-xs mx-auto px-4">
          Create your first promo code to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {promos.map((promo) => (
        <div
          key={promo.id}
          className="bg-white rounded-lg c-drop-shadow hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Content Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Discount Badge */}
              <div className="w-full sm:w-40 lg:w-48 h-28 sm:h-32 flex items-center justify-center bg-[#e8544f] rounded-lg">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
                  {promo.discountValue}% off
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600">
                  Code:{" "}
                  <span className="font-mono font-semibold text-gray-900 break-all">
                    {promo.code}
                  </span>
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                  Orders Over €{promo.minimumAmount}
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                  Time Left:{" "}
                  <span className="font-medium text-gray-900">
                    {getTimeStatus(promo)}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Used {promo.totalUses} of {promo.useLimit} times
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onEdit?.(promo.id)}
                className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium bg-[#73B7FF] text-white rounded-lg hover:bg-[#73B7FF]/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#73B7FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex-1"
                disabled={isLoading}>
                Edit
              </button>
              <button
                onClick={() => onStop?.(promo.id)}
                className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium bg-[#E8554F] text-white rounded-lg hover:bg-[#E8554F]/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8554F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex-1"
                disabled={isLoading}>
                Stop This Promo Code
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OngoingPromoCodes;
