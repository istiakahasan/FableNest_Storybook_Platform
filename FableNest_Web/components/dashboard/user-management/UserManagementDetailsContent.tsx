"use client";

import OrderDetails from "../OrderDetails";
import { useParams } from "next/navigation";
import UserDetailsCard from "../UserDetailsCard";
import UserManagementDetailsSkeleton from "./UDetailsSkeleton";
import { useGetUserDetailsQuery } from "@/store/api/dashboardApi";

const UserManagementDetailsContent = () => {
  const params = useParams();
  const userId = params.id as string;

  const { data, isLoading } = useGetUserDetailsQuery({ userId });
  if (!data && isLoading) {
    return <UserManagementDetailsSkeleton />;
  }
  return (
    <div className="space-y-6">
      {data?.data.user && <UserDetailsCard user={data?.data.user} />}

      <OrderDetails
        title="Ongoing Order Details"
        description="See information about your ongoing orders"
        orders={data?.data.ongoingOrders || []}
      />

      <OrderDetails
        title="Past Order Details"
        description="See information about your past orders"
        orders={data?.data.pastOrders || []}
      />
    </div>
  );
};

export default UserManagementDetailsContent;
