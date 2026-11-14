"use client";

import { useState, useMemo, useCallback } from "react";
import { createColumns } from "@/types/column";
import DataTable from "../DataTable";
import {
  useGetUsersQuery,
  useUnblockUserMutation,
  UserRole,
} from "@/store/api/dashboardApi";
import { GetUsersType } from "@/types/dashboard2Types";
import { toast } from "sonner";
import ConfirmationDialog from "../ConfirmationDialog";

// Helper function to format ISO date to "19 Dec, 2025" format
const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return "N/A";

  try {
    const date = new Date(isoDate);
    // Format: 19 Dec, 2025
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const SuspendContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // State for confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    role: UserRole;
    name: string;
  } | null>(null);

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    refetch,
  } = useGetUsersQuery({
    isBlocked: "true",
    limit: pageSize.toString(),
    page: currentPage.toString(),
    searchTerm: searchTerm,
  });

  const [unblockUser, { isLoading: isUnsuspending }] = useUnblockUserMutation();

  // Handle unsuspend user with confirmation
  const handleUnSuspend = useCallback(
    async (id: string, role: UserRole) => {
      try {
        await unblockUser({ userId: id, role }).unwrap();
        toast.success("User unsuspended successfully");
        // Refresh the data to reflect the change
        refetch();
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Failed to unsuspend user";
        toast.error(errorMessage);
        console.error("Failed to unsuspend user:", error);
      }
    },
    [unblockUser, refetch]
  );

  // Open confirmation modal
  const openConfirmationModal = useCallback(
    (id: string, role: UserRole, firstName: string, lastName: string) => {
      setSelectedUser({
        id,
        role,
        name: `${firstName} ${lastName}`,
      });
      setShowConfirmationModal(true);
    },
    []
  );

  // Handle confirm action
  const handleConfirm = useCallback(() => {
    if (selectedUser) {
      handleUnSuspend(selectedUser.id, selectedUser.role);
      setShowConfirmationModal(false);
      setSelectedUser(null);
    }
  }, [selectedUser, handleUnSuspend]);

  // Handle cancel action
  const handleCancel = useCallback(() => {
    setShowConfirmationModal(false);
    setSelectedUser(null);
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // Get the users array from the response
  const usersData = useMemo(() => {
    return usersResponse?.data || [];
  }, [usersResponse]);

  const columns = createColumns<GetUsersType>();

  columns.push(
    {
      key: "firstName",
      title: "User Name",
      align: "left",
      sortable: true,
      width: "180px",
      render: (_, row) => {
        return (
          <h3>
            {row.firstName} {row.lastName}
          </h3>
        );
      },
    },
    {
      key: "suspensionStarts",
      title: "Suspension Period",
      align: "left",
      sortable: false,
      width: "250px",
      render: (_, row) => {
        const hasStartDate = row.suspensionStarts;
        const hasEndDate = row.suspensionEnds;

        if (!hasStartDate && !hasEndDate) {
          return (
            <span className="text-gray-500 italic">Indefinite suspension</span>
          );
        }

        const formattedStartDate = formatDate(row.suspensionStarts);
        const formattedEndDate = formatDate(row.suspensionEnds);

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span>{formattedStartDate}</span>
              <span>-</span>
              <span>{formattedEndDate}</span>
            </div>
            {/* {row.suspensionEnds &&
                new Date(row.suspensionEnds) < new Date() && (
                  <span className="text-xs text-red-600 mt-1">
                    (Suspension expired)
                  </span>
                )} */}
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      align: "left",
      width: "160px",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                openConfirmationModal(
                  row.id,
                  row.role,
                  row.firstName,
                  row.lastName
                )
              }
              disabled={isUnsuspending}
              className="bg-[#10B981] hover:bg-[#0da271] rounded py-2.5 px-6 text-white font-semibold text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2">
              End Suspension
            </button>
          </div>
        );
      },
    }
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={usersData}
        loading={isUsersLoading}
        searchable={true}
        searchPlaceholder="Search suspended users by name or email..."
        pagination={{
          pageSize,
          currentPage,
          onPageChange: setCurrentPage,
        }}
        onSearch={handleSearch}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
        title="Are you sure you want to end suspension for this user?"
        description="The user will be able to access their account again."
        itemName={selectedUser?.name || ""}
        cancelText="Cancel"
        confirmText="End Suspension"
        variant="success"
        isLoading={isUnsuspending}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default SuspendContent;
