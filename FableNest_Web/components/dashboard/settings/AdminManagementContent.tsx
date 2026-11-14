"use client";

import { useState, useCallback } from "react";
import { createColumns } from "@/types/column";
import DataTable from "../DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import {
  useChangeUserRoleMutation,
  useGetUsersQuery,
} from "@/store/api/dashboardApi";
import { GetUsersType } from "@/types/dashboard2Types";
import AddAdminDialog from "./AddAdminDialog";
import { toast } from "sonner"; // or your preferred toast library

const AdminManagementContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch users with pagination
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery({
    role: "ADMIN",
    limit: pageSize.toString(),
    page: currentPage.toString(),
  });

  const [changeRole, { isLoading: roleChanging }] = useChangeUserRoleMutation();

  // Extract data from API response or use empty array as fallback
  const data = usersData?.data || [];

  // Handle role change
  const handleRoleChange = useCallback(
    async (id: string, newRole: "ADMIN" | "USER") => {
      try {
        // Call the mutation to change user role
        await changeRole({
          userId: id,
          role: newRole,
        }).unwrap();

        // Show success message
        toast.success(`User role changed to ${newRole.toLowerCase()}`);

        // Refresh the data
        refetch();
      } catch (error) {
        console.error("Failed to change role:", error);
        toast.error("Failed to change user role");
      }
    },
    [changeRole, refetch]
  );

  const columns = createColumns<GetUsersType>();

  columns.push(
    {
      key: "firstName",
      title: "Admin Name",
      align: "left",
      sortable: true,
      width: "400px",
      render: (_, row) => (
        <h1>
          {row.firstName} {row.lastName}
        </h1>
      ),
    },
    {
      key: "email",
      title: "Email",
      align: "left",
      sortable: false,
      width: "400px",
    },
    {
      key: "actions",
      title: "Role",
      align: "left",
      width: "100px",
      render: (_, row) => {
        return (
          <Select
            value={row.role}
            disabled={roleChanging}
            onValueChange={(value: "ADMIN" | "USER") =>
              handleRoleChange(row.id, value)
            }>
            <SelectTrigger className="w-[140px] bg-[#00244A] text-white! [&_svg]:text-white! hover:bg-[#00244A]/90 transition">
              <SelectValue placeholder="Select role">
                <span className="capitalize">{row.role}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="USER"
                className="focus:bg-[#73B7FF]! focus:text-white">
                User
              </SelectItem>
              <SelectItem
                value="ADMIN"
                className="focus:bg-[#73B7FF]! focus:text-white">
                Admin
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardPageHeaderTitle title="Admin List" />
        <AddAdminDialog />
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        pagination={{
          pageSize,
          currentPage,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
};

export default AdminManagementContent;
