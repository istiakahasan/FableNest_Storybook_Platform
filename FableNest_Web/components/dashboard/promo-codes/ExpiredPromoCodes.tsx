import React from "react";
import {
  calculateTimeDifference,
  formatTimeDifference,
} from "@/utils/timeUtils";
import { PromoCodeTypes } from "@/types/dashboard2Types";

interface ExpiredPromoCodesProps {
  promo: PromoCodeTypes;
  onSend: (id: string) => void;
  onStart: (id: string) => void;
  isLoading?: boolean;
}

const ExpiredPromoCodes: React.FC<ExpiredPromoCodesProps> = ({
  promo,
  onSend,
  onStart,
  isLoading,
}) => {
  // Calculate time since expiration
  const getTimeSinceExpiration = () => {
    if (!promo.endTime) return "Expired";

    const now = new Date();
    const endDate = new Date(promo.endTime);

    if (endDate > now) {
      // This shouldn't happen for expired promos, but handle gracefully
      return "Active";
    }

    const timeDiff = calculateTimeDifference(endDate, now);
    return `Expired ${formatTimeDifference(timeDiff)} ago`;
  };

  return (
    <div className="bg-white rounded-lg c-drop-shadow hover:shadow-lg transition-all duration-300 p-4 sm:p-6 h-full">
      <div className="flex flex-col gap-4 sm:gap-6 h-full">
        {/* Content Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          {/* Discount Badge */}
          <div className="w-full sm:w-40 lg:w-48 h-28 sm:h-32 flex items-center justify-center bg-gray-400 rounded-lg">
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
              <span className="font-medium text-gray-900">
                {getTimeSinceExpiration()}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Used {promo.totalUses} of {promo.useLimit} times
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={() => onSend(promo.id)}
            className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium bg-[#73B7FF] text-white rounded-lg hover:bg-[#73B7FF]/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#73B7FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] w-full"
            disabled={isLoading}>
            Send This Promo Code
          </button>

          <button
            onClick={() => onStart(promo.id)}
            className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium bg-[#52C41A] text-white rounded-lg hover:bg-[#52C41A]/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#52C41A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] w-full"
            disabled={isLoading}>
            Start This Promo Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredPromoCodes;
