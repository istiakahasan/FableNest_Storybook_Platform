"use client";

import { useMemo } from "react";
import TermsConditionForm from "./TermsConditionForm";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import { useParams, useRouter } from "next/navigation";
import TermsConditionUpdateForm from "./TermsConditionUpdateForm";
import { TermsAndConditionsFormData } from "@/constants/termConditionSchema";
import TermsConditionLists from "./TermsConditionLists";
import {
  useCreateTermsConditionMutation,
  useDeleteTermsConditionByIdMutation,
  useFetchAllTermsConditionsQuery,
  useFetchTermsConditionsByIdQuery,
  useUpdateTermsConditionByIdMutation,
} from "@/store/api/termsConditionApi";
import { toast } from "sonner";

const TermsConditionContent = () => {
  const router = useRouter();
  const params = useParams();
  const pId = params?.id ? String(params.id) : null;

  // Fetch all terms conditions
  const {
    data: termsConditionsResponse,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    refetch,
    error: fetchAllError,
  } = useFetchAllTermsConditionsQuery({});

  const allData = termsConditionsResponse?.data || [];

  // Fetch single term condition by ID (only when pId exists)
  const {
    data: singleTermCondition,
    isLoading: isLoadingById,
    error: fetchByIdError,
    isFetching: isFetchingById,
  } = useFetchTermsConditionsByIdQuery(pId!, { skip: !pId });

  // Mutations
  const [createTerms, { isLoading: isCreating }] =
    useCreateTermsConditionMutation();
  const [updateTerms, { isLoading: isUpdating }] =
    useUpdateTermsConditionByIdMutation();
  const [deleteTerms] = useDeleteTermsConditionByIdMutation();

  // Transform API data to form data
  const transformToFormData = (data: any): TermsAndConditionsFormData => {
    return {
      title: data.title || "",
      features: data.features || [],
    };
  };

  // Handle form submission for CREATE
  const handleCreateSubmit = async (formData: TermsAndConditionsFormData) => {
    try {
      const payload = {
        title: formData.title,
        features: formData.features,
      };

      const result = await createTerms(payload).unwrap();

      toast.success(
        result.message || "Terms & conditions created successfully!"
      );

      // Refetch the list to get updated data
      refetch();

      // Reset the form will be handled by the form component
      return result;
    } catch (error: any) {
      console.error("Error creating terms condition:", error);
      const errorMessage =
        error?.data?.message || "Failed to create terms & conditions";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handle form submission for UPDATE
  const handleUpdateSubmit = async (formData: TermsAndConditionsFormData) => {
    if (!pId) {
      toast.error("No terms & conditions ID provided");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        features: formData.features,
      };

      const result = await updateTerms({ payload, id: pId }).unwrap();

      toast.success(
        result.message || "Terms & conditions updated successfully!"
      );

      // Refetch the list to get updated data
      refetch();

      // Redirect back to list
      router.push("/dashboard/terms-condition");

      return result;
    } catch (error: any) {
      console.error("Error updating terms condition:", error);
      const errorMessage =
        error?.data?.message || "Failed to update terms & conditions";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTerms(id).unwrap();
      toast.success(
        result.message || "Terms & conditions deleted successfully!"
      );
      refetch();
    } catch (error: any) {
      console.error("Error deleting terms condition:", error);
      const errorMessage =
        error?.data?.message || "Failed to delete terms & conditions";
      toast.error(errorMessage);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (pId) {
      router.push("/dashboard/terms-condition");
    }
  };

  // Memoized page title based on mode
  const pageTitle = useMemo(() => {
    return pId ? "Edit Terms & Conditions" : "Add New Terms & Conditions";
  }, [pId]);

  // Show loading state while fetching initial data for edit
  if (pId && (isLoadingById || isFetchingById)) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 animate-pulse">
        {/* Form Skeleton */}
        <div className="space-y-6">
          {/* Title Field Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Features Section Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-5 w-64 bg-gray-200 rounded"></div>

              {/* Dynamic Feature Input Fields Skeleton */}
              <div className="space-y-3 sm:space-y-4">
                {[1, 2].map((_, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Feature Button Skeleton */}
            <div className="flex justify-end">
              <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="h-10 sm:h-12 w-full sm:w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 sm:h-12 w-full sm:w-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // If in edit mode but there's an error or data is not found
  if (pId && fetchByIdError) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Terms & conditions data not found</p>
        <button
          onClick={() => router.push("/dashboard/terms-condition")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Terms & Conditions
        </button>
      </div>
    );
  }

  // Prepare initial data for edit form
  const initialData =
    pId && singleTermCondition?.data
      ? transformToFormData(singleTermCondition.data)
      : null;

  // Determine if we should show the terms & conditions list section
  const shouldShowTermsConditionList = !pId; // Only show list when not in edit mode

  return (
    <div className="space-y-8">
      <DashboardPageHeaderTitle title={pageTitle} />

      {pId && initialData ? (
        // Edit Mode
        <TermsConditionUpdateForm
          initialData={initialData}
          onSubmit={handleUpdateSubmit}
          isLoading={isUpdating}
          onCancel={handleCancel}
        />
      ) : (
        // Create Mode
        <>
          <TermsConditionForm
            onSubmit={handleCreateSubmit}
            onCancel={handleCancel}
            isLoading={isCreating}
          />

          {/* Always show Terms & Conditions Lists section when not in edit mode */}
          {shouldShowTermsConditionList && (
            <>
              <DashboardPageHeaderTitle title="Terms & Conditions" />
              <TermsConditionLists
                data={allData}
                onDelete={handleDelete}
                isLoadingAll={isLoadingAll || isFetchingAll}
                error={fetchAllError}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TermsConditionContent;
