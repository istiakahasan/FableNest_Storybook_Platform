"use client";

import { useState } from "react";
import Link from "next/link";
import { PrivacyPolicyTypes } from "@/types/dashboard2Types";

interface PrivacyPolicyListsProps {
  data: PrivacyPolicyTypes[];
  onDelete: (id: string) => Promise<void>;
  isLoadingAll?: boolean;
  error?: any;
}

const PrivacyPolicyLists = ({
  data,
  onDelete,
  isLoadingAll = false,
  error,
}: PrivacyPolicyListsProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this privacy policy?")) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Show loading skeleton when data is being fetched
  if (isLoadingAll && data.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 md:p-6 c-drop-shadow w-full space-y-4 animate-pulse">
            {/* Title skeleton */}
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>

            {/* Features skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>

            {/* Date and buttons skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-36 bg-gray-200 rounded"></div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl">
        <div className="text-red-500 mb-2">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-700 font-medium">
          Failed to load privacy policies
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  // Show empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl">
        <div className="text-gray-400 mb-3">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600">No privacy policies found.</p>
        <p className="text-gray-500 text-sm mt-1">
          Create your first privacy policy using the form above.
        </p>
      </div>
    );
  }

  // Show success state with data
  return (
    <div className="space-y-4 md:space-y-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white hover:shadow-md transition-all duration-200 rounded-xl p-4 md:p-6 c-drop-shadow w-full space-y-3 md:space-y-4">
          <h2 className="font-semibold text-lg md:text-xl text-[#374151]">
            {item.title}
          </h2>

          {item.features && item.features.length > 0 ? (
            <ul className="text-[#61758A] space-y-1 md:space-y-2 list-disc text-sm md:text-base ml-4 md:ml-6">
              {item.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[#61758A] text-sm md:text-base italic">
              No features added
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs md:text-sm text-[#61758A]">
              <p>Created: {formatDate(item.createdAt)}</p>
              <p>Updated: {formatDate(item.updatedAt)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <Link
                href={`/dashboard/privacy-policy/edit/${item.id}`}
                className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-[#73B7FF] text-white font-medium rounded-lg hover:bg-[#73B7FF]/90 transition-colors focus:outline-none text-xs sm:text-sm md:text-base w-full sm:w-auto text-center">
                Make change
              </Link>

              <button
                onClick={() => handleDeleteClick(item.id)}
                disabled={deletingId === item.id}
                className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-[#FF4D4F] text-white font-medium rounded-lg hover:bg-[#FF4D4F]/90 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base w-full sm:w-auto text-center">
                {deletingId === item.id ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicyLists;
