"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import TopSummaryCard from "../TopSummaryCard";
import RevenueStatsChart from "./RevenueChart";
import AvgGrowthPieChart from "./AvgGrowthPieChart";
import Badge from "../Badge";
import DataTable from "../DataTable";

import { useGetOverviewQuery } from "@/store/api/dashboardApi";
import ErrorComponent from "@/components/shared/ErrorComponent";

/* =======================
   TYPES
======================= */

type TimeFramePeriod = "6months" | "1year";
type GrowthTimeFrame = "monthly" | "yearly";
type OrderStatusUI =
  | "Completed"
  | "Pending"
  | "Processing"
  | "Cancelled"
  | "Shipped";
type AlignType = "left" | "center" | "right";

interface OrderData {
  id: string;
  userName: string;
  email: string;
  bookType: "Generated" | "Customized";
  bookPrice: string;
  shipping: string;
  orderId: string;
  status: OrderStatusUI;
  total: string;
  date: string;
}

interface Column<T> {
  key: keyof T | "actions";
  title: string;
  sortable?: boolean;
  width?: string;
  align?: AlignType;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

type OrderColumn = Column<OrderData>;

interface RevenueDataPoint {
  day: string;
  generated: number;
  customized: number;
  originalLabel: string;
  revenue: number;
}

/* =======================
   CONSTANTS
======================= */

const TABLE_PAGE_SIZE = 5;
const MONTH_ABBREVIATIONS = [
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
] as const;

const STATUS_BADGE_VARIANTS: Record<
  OrderStatusUI,
  "green" | "red" | "purple" | "yellow"
> = {
  Completed: "green",
  Cancelled: "red",
  Processing: "purple",
  Pending: "yellow",
  Shipped: "green",
};

/* =======================
   UTILITY FUNCTIONS
======================= */

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const truncateOrderId = (id: string, length = 8): string => {
  return id.substring(0, length);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDisplayLabel = (label: string): string => {
  const [year, month] = label.split("-");
  const monthIndex = Math.max(0, Math.min(11, parseInt(month, 10) - 1));
  const monthName = MONTH_ABBREVIATIONS[monthIndex] || month;

  return year === "2025" ? monthName : `${monthName} '${year.slice(-2)}`;
};

/* =======================
   SKELETON COMPONENTS
======================= */

export const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-5 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const SkeletonChart = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white rounded-lg shadow p-5 animate-pulse ${className}`}>
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const SkeletonGrid = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={`skeleton-card-${index}`} />
    ))}
  </div>
);

/* =======================
   COMPONENT
======================= */

const OverviewContent = () => {
  const [periodTimeFrame, setPeriodTimeFrame] =
    useState<TimeFramePeriod>("1year");
  const [growthTimeFrame, setGrowthTimeFrame] =
    useState<GrowthTimeFrame>("yearly");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useGetOverviewQuery({
    period: periodTimeFrame,
    growth: growthTimeFrame,
  });

  const translate = useTranslations("Dashboard.OverViewPage");
  const router = useRouter();

  const overview = data?.data;

  /* =======================
     DERIVED DATA
  ======================= */

  const tableData: OrderData[] = useMemo(() => {
    const orders = overview?.organizedOrders;
    if (!orders) return [];

    return orders.map((order) => ({
      id: order.id,
      userName: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email,
      bookType: "Generated" as const,
      bookPrice: formatCurrency(order.totalPrice),
      shipping: "0.00",
      orderId: truncateOrderId(order.id),
      status: ((): OrderStatusUI => {
        switch (order.orderStatus) {
          case "COMPLETED":
            return "Completed";
          case "PENDING":
            return "Pending";
          default:
            return "Processing";
        }
      })(),
      total: formatCurrency(order.totalPrice),
      date: formatDate(new Date()),
    }));
  }, [overview?.organizedOrders]);

  const revenueChartData: RevenueDataPoint[] = useMemo(() => {
    const revenueData = overview?.revenueData;
    if (!revenueData) return [];

    const dataToShow = [...revenueData];
    let slicedData = dataToShow;

    if (periodTimeFrame === "6months" && dataToShow.length > 6) {
      slicedData = dataToShow.slice(-6);
    } else if (periodTimeFrame === "1year" && dataToShow.length > 12) {
      slicedData = dataToShow.slice(-12);
    }

    return slicedData.map((item) => ({
      day: getDisplayLabel(item.label),
      generated: item.revenue,
      customized: 0,
      originalLabel: item.label,
      revenue: item.revenue,
    }));
  }, [overview?.revenueData, periodTimeFrame]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableData;

    const query = searchQuery.toLowerCase().trim();

    return tableData.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (key === "id") return false;
        return value.toString().toLowerCase().includes(query);
      }),
    );
  }, [tableData, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * TABLE_PAGE_SIZE;
    const endIndex = startIndex + TABLE_PAGE_SIZE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  /* =======================
     EVENT HANDLERS
  ======================= */

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleRowClick = useCallback(
    (row: OrderData) => {
      router.push(`/dashboard/order-management/details/${row.id}`);
    },
    [router],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /* =======================
     COLUMNS CONFIGURATION
  ======================= */

  const columns: OrderColumn[] = [
    {
      key: "userName",
      title: "User Name",
      sortable: true,
      width: "180px",
    },
    {
      key: "email",
      title: "E-mail",
      sortable: true,
      width: "220px",
    },
    {
      key: "bookType",
      title: "Book Type",
      sortable: true,
      width: "140px",
    },
    {
      key: "bookPrice",
      title: "Book Price",
      sortable: true,
      width: "120px",
      align: "left",
    },
    {
      key: "shipping",
      title: "Shipping",
      sortable: true,
      width: "120px",
      align: "left",
    },
    {
      key: "orderId",
      title: "Order ID",
      sortable: true,
      width: "140px",
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      width: "130px",
      render: (value) => {
        const status = value as OrderStatusUI;
        return (
          <Badge variant={STATUS_BADGE_VARIANTS[status] || "green"}>
            {status}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "120px",
      render: (_, row) => (
        <Link
          href={`/dashboard/order-management/details/${row.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          onClick={(e) => e.stopPropagation()}>
          View Details
        </Link>
      ),
    },
  ];

  /* =======================
     RENDER STATES
  ======================= */

  if (isError) {
    return <ErrorComponent error={error} fullScreen />;
  }

  const renderLoadingState = () => (
    <>
      <SkeletonGrid />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <SkeletonChart className="lg:col-span-3" />
        <SkeletonChart className="lg:col-span-2" />
      </div>
      <DataTable
        title="Recent orders"
        columns={columns}
        data={[]}
        loading={true}
        searchable
        searchPlaceholder="Search..."
        pagination={{
          pageSize: TABLE_PAGE_SIZE,
          currentPage: 1,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
      />
    </>
  );

  const renderContent = () => (
    <>
      {/* Summary Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TopSummaryCard
            title="Total Orders"
            value={overview.overviewCards.totalOrder}
          />
          <TopSummaryCard
            title="Total Users"
            value={overview.overviewCards.totalUser}
          />
          <TopSummaryCard
            title="Revenue"
            value={formatCurrency(overview.overviewCards.totalRevenue)}
          />
          <TopSummaryCard
            title="New Users"
            value={overview.overviewCards.newUsersThisMonth}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <RevenueStatsChart
            data={revenueChartData}
            periodTimeFrame={periodTimeFrame}
            setPeriodTimeFrame={setPeriodTimeFrame}
          />
        </div>
        <div className="lg:col-span-2">
          <AvgGrowthPieChart
            growthTimeFrame={growthTimeFrame}
            setGrowthTimeFrame={setGrowthTimeFrame}
            percentage={overview?.growthLevel || 0}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Recent orders"
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        searchable
        searchPlaceholder="Search..."
        onRowClick={handleRowClick}
        pagination={{
          pageSize: TABLE_PAGE_SIZE,
          currentPage,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
      />
    </>
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeaderTitle title={translate("overview")} />
      {isLoading ? renderLoadingState() : renderContent()}
    </div>
  );
};

export default OverviewContent;
