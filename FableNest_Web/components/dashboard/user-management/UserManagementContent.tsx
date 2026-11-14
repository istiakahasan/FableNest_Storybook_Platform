"use client";

import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import TopSummaryCard from "../TopSummaryCard";
import DataTable from "../DataTable";
import { createColumns } from "@/types/column";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/dashboardTypes";
import { User, UserPlus } from "lucide-react";
import { SkeletonCard } from "../overview/OverviewContent";
import { useGetAllUsersQuery } from "@/store/api/dashboardApi";
import ErrorComponent from "@/components/shared/ErrorComponent";

const UserManagementContent = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const pageSize = 5;

  // Fetch data with proper pagination parameters
  const { data, isLoading, isError, error } = useGetAllUsersQuery({
    limit: pageSize.toString(),
    page: currentPage.toString(),
    searchTerm: searchQuery,
  });

  const router = useRouter();

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Row click
  const handleRowClick = (row: UserType) => {
    router.push(`/dashboard/user-management/details/${row.id}`);
  };

  // Filtered data for search (client-side fallback if API doesn't support search)
  const filteredData = (() => {
    // If we're using API search, return the API data directly
    if (!searchQuery.trim()) return data?.data || [];

    // Client-side filtering as fallback
    const q = searchQuery.toLowerCase();
    return (data?.data || []).filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(q)
      )
    );
  })();

  const sumCard = () => {
    return [
      { title: "Total Users", value: data?.meta?.total || 0, icon: User },
      {
        title: "New Users This Month",
        value: data?.stats?.newUsersThisMonth || 0,
        icon: UserPlus,
      },
    ];
  };

  // Columns definition
  const columns = createColumns<UserType>();

  columns.push(
    {
      key: `firstName`,
      title: "User Name",
      align: "left",
      sortable: true,
      width: "180px",
    },
    {
      key: "email",
      title: "Email",
      align: "left",
      sortable: true,
      width: "250px",
    },
    {
      key: "booksCount",
      title: "Book Created",
      align: "left",
      sortable: true,
      width: "180px",
    },
    {
      key: "isOngoingOrder",
      title: "Ongoing Order",
      align: "left",
      sortable: true,
      width: "180px",
      render: (_, row) => {
        return row.isOngoingOrder ? "Yes" : "No";
      },
    },
    {
      key: "actions",
      title: "Details",
      align: "left",
      width: "100px",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/user-management/details/${row.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              View Details
            </Link>
          </div>
        );
      },
    }
  );

  if (isError) {
    return <ErrorComponent error={error} fullScreen />;
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeaderTitle title="User Overview" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          sumCard().map((item, index) => (
            <TopSummaryCard
              icon={item.icon}
              title={item.title}
              value={item.value}
              key={index}
            />
          ))
        )}
      </div>

      {/* Data Table */}
      <DataTable
        title="User Management"
        columns={columns}
        data={filteredData}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Search..."
        onRowClick={handleRowClick}
        pagination={{
          pageSize,
          currentPage,
          onPageChange: setCurrentPage,
        }}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default UserManagementContent;
