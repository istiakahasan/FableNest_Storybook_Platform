"use client";

import { useParams } from "next/navigation";
import BookDetailsCard from "../BookDetailsCard";
import UserDetailsCard from "../UserDetailsCard";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderDetailsDataType } from "@/types/dashboard2Types";
import { useGetOrderDetailsQuery } from "@/store/api/dashboardApi";
import ErrorComponent from "@/components/shared/ErrorComponent";

/* ================= MOCK ================= */
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/* ================= COMPONENT ================= */

const OrderDetailsContent = () => {
  const params = useParams();
  const orderId = params.id as string;

  const { data, isLoading, isError, error } = useGetOrderDetailsQuery({
    orderId,
  });

  if (isError) {
    return <ErrorComponent error={error} fullScreen />;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 w-full">
        <DashboardPageHeaderTitle
          title="User Details"
          sub_title="Manage user roles and status"
        />

        <Separator className="my-6" />

        {/* USER INFORMATION */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                <Skeleton className="h-6 w-48" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                <Skeleton className="h-6 w-full max-w-sm" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
                <Badge className="capitalize">
                  <Skeleton className="h-4 w-20" />
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ROLE MANAGEMENT */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[140px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const order: OrderDetailsDataType | undefined = data?.data;
  if (!order) return null;

  return (
    <div className="space-y-6">
      <UserDetailsCard user={order.user} />

      {order.books.map((book) => (
        <BookDetailsCard
          orderId={order.id}
          orderStatus={order.orderStatus}
          key={book.id}
          title="Book Details"
          sub_title="See information about the book"
          book={book}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default OrderDetailsContent;
