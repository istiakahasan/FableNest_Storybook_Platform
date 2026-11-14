"use client";

import { useState } from "react";
import { Separator } from "../ui/separator";
import DashboardPageHeaderTitle from "./DashboardPageHeaderTitle";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, ShieldAlert, User } from "lucide-react";
import { Badge } from "../ui/badge";
import ConfirmationDialog from "./ConfirmationDialog";
import { UserDataType } from "@/types/dashboard2Types";
import {
  useBlockUserMutation,
  useChangeUserRoleMutation,
  useUnblockUserMutation,
} from "@/store/api/dashboardApi";
import { toast } from "sonner";

/* ================= PROPS ================= */

interface UserDetailsCardProps {
  user: UserDataType;
}

/* ================= COMPONENT ================= */

const UserDetailsCard = ({ user }: UserDetailsCardProps) => {
  const [currentUser, setCurrentUser] = useState<UserDataType>(user);
  const [selectedRole, setSelectedRole] = useState<any>(user.role);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actual API mutations
  const [changeRoleAction, { isLoading: isChangingRole }] =
    useChangeUserRoleMutation();
  const [blockUserAction, { isLoading: isSuspending }] = useBlockUserMutation();
  const [unblockUserAction] = useUnblockUserMutation();

  /* ================= HANDLERS ================= */

  const handleRoleChange = async (newRole: any) => {
    if (newRole === currentUser.role) return;
    console.log("check id:::::::::::", currentUser.id);

    setError(null);
    setSelectedRole(newRole);

    try {
      const result = await changeRoleAction({
        userId: currentUser.id,
        role: newRole,
      }).unwrap();

      if (result.success) {
        setCurrentUser((prev) => ({ ...prev, role: newRole }));
        toast.success("User role updated successfully");
      } else {
        throw new Error(result.message || "Failed to update user role");
      }
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to update user role. Please try again."
      );
      setSelectedRole(currentUser.role);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleSuspendUser = async () => {
    setError(null);

    try {
      const result = await blockUserAction({
        userId: currentUser.id,
        role: currentUser.role,
      }).unwrap();

      if (result.success) {
        setCurrentUser((prev) => ({
          ...prev,
          isBlocked: true,
        }));
        setShowSuspendModal(false);
        toast.success("User suspended successfully");
      } else {
        throw new Error(result.message || "Failed to suspend user");
      }
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to suspend user. Please try again."
      );
      toast.error("Failed to suspend user. Please try again.");
    }
  };

  const handleUnblockUser = async () => {
    setError(null);

    try {
      const result = await unblockUserAction({
        userId: currentUser.id,
        role: currentUser.role,
      }).unwrap();

      if (result.success) {
        setCurrentUser((prev) => ({
          ...prev,
          isBlocked: false,
        }));
        toast.success("User activated successfully");
      } else {
        throw new Error(result.message || "Failed to unblock user");
      }
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to unblock user. Please try again."
      );
      toast.error("Failed to unblock user. Please try again.");
    }
  };

  /* ================= HELPERS ================= */

  const getRoleIcon = (role: any) =>
    role === "ADMIN" ? (
      <ShieldAlert className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );

  /* ================= RENDER ================= */

  return (
    <div className="bg-white rounded-xl p-6 w-full">
      <DashboardPageHeaderTitle
        title="User Details"
        sub_title="Manage user roles and status"
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Separator className="my-6" />

      {/* USER INFORMATION */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
              <p className="text-lg font-normal text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-lg font-normal text-gray-900 break-all">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
              <Badge className="capitalize">
                {currentUser.role.toLowerCase()}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <Badge
                className={`capitalize ${
                  currentUser.isBlocked
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-green-100 text-green-800 hover:bg-green-100"
                }`}>
                {currentUser.isBlocked ? "Suspended" : "Active"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* ROLE MANAGEMENT */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getRoleIcon(currentUser.role)}
              <span className="font-medium text-gray-900">Change Role</span>
            </div>
            <p className="text-sm text-gray-500">
              Current role:{" "}
              <span className="font-medium capitalize">
                {currentUser.role.toLowerCase()}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={selectedRole}
              onValueChange={(value: any) => handleRoleChange(value)}
              disabled={isChangingRole || currentUser.isBlocked}>
              <SelectTrigger className="w-[180px] bg-[#00244A] hover:bg-[#00244A]/90 text-white">
                {isChangingRole ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <SelectValue>
                    <span className="capitalize">
                      {selectedRole.toLowerCase()}
                    </span>
                  </SelectValue>
                )}
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>

            {currentUser.isBlocked ? (
              <Button
                variant="default"
                onClick={handleUnblockUser}
                disabled={isSuspending}
                className="bg-green-600 hover:bg-green-700 text-white">
                {isSuspending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  "Activate User"
                )}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setShowSuspendModal(true)}
                disabled={isSuspending}>
                {isSuspending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suspending...
                  </>
                ) : (
                  "Suspend User"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        open={showSuspendModal}
        onOpenChange={setShowSuspendModal}
        title="Are you sure you want to suspend this user?"
        description="The user will lose access to their account until reinstated."
        itemName={`${currentUser.firstName} ${currentUser.lastName}`}
        cancelText="Cancel"
        confirmText="Suspend User"
        variant="destructive"
        isLoading={isSuspending}
        onConfirm={handleSuspendUser}
        onCancel={() => setShowSuspendModal(false)}
      />
    </div>
  );
};

export default UserDetailsCard;
