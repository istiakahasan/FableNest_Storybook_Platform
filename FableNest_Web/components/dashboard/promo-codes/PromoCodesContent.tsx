// components/PromoCodeContent.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  useActivatePromoMutation,
  useDeactivatePromoMutation,
  useGetAllPromoQuery,
} from "@/store/api/promoApi";
import OngoingPromoCodes from "./OngoingPromoCodes";
import ExpiredPromoCodes from "./ExpiredPromoCodes";
import { PromoCodeTypes } from "@/types/dashboard2Types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Main component
const PromoCodeContent: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetAllPromoQuery({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [stopPromoAction, { isLoading: isStopping }] =
    useDeactivatePromoMutation();
  const [startPromoAction, { isLoading: isStarting }] =
    useActivatePromoMutation();

  // Track initial load completion
  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  // Combined loading state for mutations
  const isMutationLoading = isStopping || isStarting;

  // Show skeleton only on initial load when data is empty
  const showInitialSkeleton =
    isInitialLoad && (!data || !data.data || data.data.length === 0);

  // Memoize the promo lists to prevent unnecessary recalculations
  const { ongoingPromos, expiredPromos } = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return { ongoingPromos: [], expiredPromos: [] };
    }

    const now = new Date();

    return data.data.reduce<{
      ongoingPromos: PromoCodeTypes[];
      expiredPromos: PromoCodeTypes[];
    }>(
      (acc, promo) => {
        const endTime = new Date(promo.endTime);
        const isExpired = !promo.isActive || endTime < now;

        if (isExpired) {
          acc.expiredPromos.push(promo);
        } else {
          acc.ongoingPromos.push(promo);
        }

        return acc;
      },
      { ongoingPromos: [], expiredPromos: [] }
    );
  }, [data]);

  // Event handlers
  const handleCreateNew = () => {
    console.log("Create new promo code");
    // Implementation for creating new promo
  };

  const handleEdit = async (id: string) => {
    console.log("Edit promo:", id);
    router.push(`/dashboard/promo-codes/edit/${id}`);
  };

  const handleStop = async (id: string) => {
    try {
      const response = await stopPromoAction(id).unwrap();

      if (response.success) {
        toast.success(response.message || "Promo code stopped successfully!");
        refetch(); // Refresh the data
      } else {
        throw new Error(response.message || "Failed to stop promo code");
      }
    } catch (error: any) {
      console.error("Error stopping promo code:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to stop promo code. Please try again."
      );
    }
  };

  const handleStart = async (id: string) => {
    try {
      const response = await startPromoAction(id).unwrap();

      if (response.success) {
        toast.success(response.message || "Promo code activated successfully!");
        refetch(); // Refresh the data
      } else {
        throw new Error(response.message || "Failed to activate promo code");
      }
    } catch (error: any) {
      console.error("Error activating promo code:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to activate promo code. Please try again."
      );
    }
  };

  const handleSend = async (id: string) => {
    console.log("Send promo:", id);
    // Implementation for sending expired promo
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeaderTitle title="Ongoing Promo Codes" />
        <Link
          href={"/dashboard/promo-codes/create"}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-medium bg-[#73B7FF] text-white rounded-lg hover:bg-[#73B7FF]/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#73B7FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          onClick={handleCreateNew}>
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Create New Code</span>
        </Link>
      </div>

      {/* Ongoing Promo Codes Section */}
      <section className="mt-6">
        <OngoingPromoCodes
          promos={ongoingPromos}
          onEdit={handleEdit}
          onStop={handleStop}
          isLoading={isMutationLoading}
          showSkeleton={showInitialSkeleton}
        />
      </section>

      {/* Expired Promo Codes Section */}
      <section className="space-y-4 md:space-y-6 pt-6 md:pt-8 border-t border-gray-200">
        <DashboardPageHeaderTitle title="Expired Promo Codes" />

        <div className="mt-4">
          {showInitialSkeleton ? (
            // Show loading skeletons only on initial load when data is empty
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 sm:h-56 md:h-60 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : expiredPromos.length > 0 ? (
            // Show expired promos if they exist
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {expiredPromos.map((promo) => (
                <ExpiredPromoCodes
                  key={promo.id}
                  promo={promo}
                  onSend={handleSend}
                  onStart={handleStart}
                  isLoading={isMutationLoading}
                />
              ))}
            </div>
          ) : (
            // Show empty state only when data is loaded and there are no expired promos
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
                No expired promo codes
              </h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-xs mx-auto px-4">
                All your active promo codes will appear here when they expire
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PromoCodeContent;
