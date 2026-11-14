"use client";

import { useState, useMemo, useCallback } from "react";
import DataTable from "../DataTable";
import { createColumns } from "@/types/column";
import Link from "next/link";
import Badge from "../Badge";
import { useRouter } from "next/navigation";
import { OrderItemType } from "@/types/dashboard2Types";
import { useGetAllOrdersQuery } from "@/store/api/dashboardApi";
import ErrorComponent from "@/components/shared/ErrorComponent";

const PAGE_SIZE = 8;

const OrderManagementContent = () => {
  const router = useRouter();

  // ✅ single source of truth for search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useGetAllOrdersQuery({
    limit: PAGE_SIZE.toString(),
    page: currentPage.toString(),
    searchTerm: searchQuery,
  });

  console.log("check is ERROR:::::::::::::", isError, error);

  /* ================= Columns ================= */
  const columns = useMemo(() => {
    const cols = createColumns<OrderItemType>();

    cols.push(
      {
        key: "user",
        title: "User Name",
        sortable: true,
        width: "180px",
        render: (_, row) => (
          <span>
            {row.user?.firstName} {row.user?.lastName}
          </span>
        ),
      },
      {
        key: "suspension_period",
        title: "Email",
        sortable: true,
        width: "250px",
        render: (_, row) => row.user?.email ?? "",
      },
      {
        key: "bookCount",
        title: "Book Count",
        sortable: true,
        width: "140px",
      },
      {
        key: "totalAmount",
        title: "Price",
        sortable: true,
        width: "140px",
      },
      {
        key: "id",
        title: "Order ID",
        width: "180px",
      },
      {
        key: "orderStatus",
        title: "Status",
        sortable: true,
        width: "160px",
        render: (_, row) => (
          <Badge
            variant={
              row.orderStatus === "COMPLETED"
                ? "green"
                : row.orderStatus === "CANCELLED"
                ? "red"
                : row.orderStatus === "PENDING"
                ? "purple"
                : "yellow"
            }>
            {row.orderStatus}
          </Badge>
        ),
      },
      {
        key: "actions",
        title: "Details",
        width: "120px",
        render: (_, row) => (
          <Link
            href={`/dashboard/order-management/details/${row.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}>
            View Details
          </Link>
        ),
      }
    );

    return cols;
  }, []);

  /* ================= Data ================= */
  const tableData = useMemo(() => data?.data ?? [], [data]);

  /* ================= Handlers ================= */
  const handleSearch = useCallback((value: string) => {
    setCurrentPage(1); // 🔑 search করলে page reset
    setSearchQuery(value);
  }, []);

  const handleRowClick = useCallback(
    (row: OrderItemType) => {
      router.push(`/dashboard/order-management/details/${row.id}`);
    },
    [router]
  );

  if (isError) {
    return <ErrorComponent error={error} fullScreen />;
  }

  return (
    <DataTable
      title="Order Management"
      columns={columns}
      data={tableData}
      loading={isLoading}
      searchable
      searchPlaceholder="Search orders..."
      onSearch={handleSearch}
      onRowClick={handleRowClick}
      pagination={{
        pageSize: PAGE_SIZE,
        currentPage,
        onPageChange: setCurrentPage,
      }}
    />
  );
};

export default OrderManagementContent;
