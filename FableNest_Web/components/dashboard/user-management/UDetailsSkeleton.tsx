import React from "react";

const UserManagementDetailsSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* User Details Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {/* Name Section */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-5 w-56 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Role Section */}
        <div className="mb-8">
          <div className="h-6 w-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-8"></div>

        {/* Change Role Section */}
        <div>
          <div className="h-6 w-36 bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Ongoing Order Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 w-72 bg-gray-200 rounded"></div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6"></div>

        {/* Order Card Skeleton */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            {/* Book Title */}
            <div className="h-5 w-56 bg-gray-200 rounded-lg mb-3"></div>

            {/* Book Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Code, Date, Order ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-56 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Order Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="h-6 w-44 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 w-72 bg-gray-200 rounded"></div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6"></div>

        {/* Order Card Skeleton */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            {/* Book Title */}
            <div className="h-5 w-56 bg-gray-200 rounded-lg mb-3"></div>

            {/* Book Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Code, Date, Order ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-56 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDetailsSkeleton;
