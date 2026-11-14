"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardPageHeaderTitle from "./DashboardPageHeaderTitle";
import { BooksDataType } from "@/types/dashboard2Types";
import { useChangeOrderStatusMutation } from "@/store/api/dashboardApi";
import { toast } from "sonner";

interface BookDetailsCardProps {
  book: BooksDataType;
  orderId: string;
  orderStatus: string;
  onStatusChange?: (orderId: string, newStatus: any) => Promise<void>;
  isLoading?: boolean;
  title: string;
  sub_title?: string;
}

/* ================= COMPONENT ================= */

const BookDetailsCard = ({
  title,
  sub_title,
  book,
  orderId,
  orderStatus,
  onStatusChange,
  isLoading = false,
}: BookDetailsCardProps) => {
  const [selectedStatus, setSelectedStatus] = useState<any>(orderStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updateStatusAction, { isLoading: updateIsLoading }] =
    useChangeOrderStatusMutation();

  const handleStatusChange = async (newStatus: any) => {
    if (newStatus === orderStatus) {
      setShowStatusSelector(false);
      return;
    }

    setError(null);
    setIsUpdating(true);

    try {
      // Call the actual API
      const result = await updateStatusAction({
        orderId: orderId,
        orderStatus: newStatus,
      }).unwrap();

      if (result.success) {
        setSelectedStatus(newStatus);
        setShowStatusSelector(false);
        toast.success("Order status updated successfully!");
        // If parent component provides callback for optimistic updates
        if (onStatusChange) {
          await onStatusChange(orderId, newStatus);
        }
      } else {
        throw new Error(result.message || "Failed to update order status");
      }
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to update order status. Please try again."
      );
      toast.error(
        err?.data?.message || "Failed to update order status. Please try again."
      );
      setSelectedStatus(orderStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveStatus = async () => {
    await handleStatusChange(selectedStatus);
  };

  const handleCancelStatusChange = () => {
    setShowStatusSelector(false);
    setSelectedStatus(orderStatus);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-6 w-full">
      <div className="mb-6">
        <DashboardPageHeaderTitle title={title} sub_title={sub_title} />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Separator className="my-6" />

      <div className="space-y-6">
        <div className="space-y-5">
          <DetailRow label="Book Name:" value={book.title || "N/A"} />
          <DetailRow label="Child Name:" value={book.characterName || "N/A"} />
          <DetailRow label="Child Gender:" value={book.gender || "N/A"} />
          <DetailRow
            label="Child Age:"
            value={book.characterAge.toString() || "N/A"}
          />
          {/* <DetailRow
            label="Chapter:"
            value={book.totalChapters.toString() || "N/A"}
          /> */}
          <DetailRow label="Book Price:" value={`€ ${book.price || "N/A"}`} />
          <DetailRow label="Shipping Cost:" value={`€ 10`} />
          <DetailRow label="Total Cost:" value={`€ ${book.price + 10}`} />
          <DetailRow label="Order ID:" value={orderId || "N/A"} />
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <p className="text-base font-normal text-gray-900">Status:</p>

          <div className="flex items-center gap-4">
            {showStatusSelector ? (
              <>
                <Select
                  value={selectedStatus}
                  onValueChange={(v: any) => setSelectedStatus(v)}
                  disabled={isUpdating || updateIsLoading}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleSaveStatus}
                  disabled={
                    isUpdating ||
                    updateIsLoading ||
                    selectedStatus === orderStatus
                  }
                  className="bg-[#00244A] hover:bg-[#00244A]/90 text-white px-6">
                  {isUpdating || updateIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancelStatusChange}
                  disabled={isUpdating || updateIsLoading}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <p className="capitalize">{selectedStatus.toLowerCase()}</p>
                <Button
                  onClick={() => setShowStatusSelector(true)}
                  className="bg-[#00244A] hover:bg-[#00244A]/90 text-white px-6">
                  Update Status
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= HELPER ================= */

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start">
    <p className="text-base font-normal text-gray-900 w-48">{label}</p>
    <p className="text-base font-normal text-gray-900">{value}</p>
  </div>
);

export default BookDetailsCard;
