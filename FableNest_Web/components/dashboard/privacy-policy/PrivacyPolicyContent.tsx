"use client";

import { useMemo } from "react";
import PrivacyPolicyForm from "./PrivacyPolicyForm";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import { useParams, useRouter } from "next/navigation";
import PrivacyPolicyUpdateForm from "./PrivacyPolicyUpdateForm";
import { PrivacyPolicyFormData } from "@/constants/privacyPolicySchema";
import PrivacyPolicyLists from "./PrivacyPolicyLists";
import {
  useCreatePrivacyPolicyMutation,
  useDeletePrivacyPolicyByIdMutation,
  useFetchAllPrivacyPoliciesQuery,
  useFetchPrivacyPolicyByIdQuery,
  useUpdatePrivacyPolicyByIdMutation,
} from "@/store/api/privacyPolicyApi";
import { PrivacyPolicyTypes } from "@/types/dashboard2Types";
import { toast } from "sonner";

const PrivacyPolicyContent = () => {
  const router = useRouter();
  const params = useParams();
  const pId = params?.id ? String(params.id) : null;

  // Fetch all privacy policies
  const {
    data: privacyPoliciesResponse,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    refetch,
    error: fetchAllError,
  } = useFetchAllPrivacyPoliciesQuery({});

  const allData = privacyPoliciesResponse?.data || [];

  // Fetch single privacy policy by ID (only when pId exists)
  const {
    data: singlePrivacyPolicyResponse,
    isLoading: isLoadingById,
    error: fetchByIdError,
    isFetching: isFetchingById,
  } = useFetchPrivacyPolicyByIdQuery(pId!, { skip: !pId });

  const singlePrivacyPolicy = singlePrivacyPolicyResponse?.data;

  // Mutations
  const [createPrivacyPolicy, { isLoading: isCreating }] =
    useCreatePrivacyPolicyMutation();
  const [updatePrivacyPolicy, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicyByIdMutation();
  const [deletePrivacyPolicy] = useDeletePrivacyPolicyByIdMutation();

  // Transform API data to form data
  const transformToFormData = (
    data: PrivacyPolicyTypes
  ): PrivacyPolicyFormData => {
    return {
      title: data.title || "",
      features: data.features || [],
    };
  };

  // Handle form submission for CREATE
  const handleCreateSubmit = async (formData: PrivacyPolicyFormData) => {
    try {
      const payload = {
        title: formData.title,
        features: formData.features,
      };

      const result = await createPrivacyPolicy(payload).unwrap();

      toast.success(result.message || "Privacy policy created successfully!");

      // Refetch the list to get updated data
      refetch();

      return result;
    } catch (error: any) {
      console.error("Error creating privacy policy:", error);
      const errorMessage =
        error?.data?.message || "Failed to create privacy policy";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handle form submission for UPDATE
  const handleUpdateSubmit = async (formData: PrivacyPolicyFormData) => {
    if (!pId) {
      toast.error("No privacy policy ID provided");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        features: formData.features,
      };

      const result = await updatePrivacyPolicy({ payload, id: pId }).unwrap();

      toast.success(result.message || "Privacy policy updated successfully!");

      // Refetch the list to get updated data
      refetch();

      // Redirect back to list
      router.push("/dashboard/privacy-policy");

      return result;
    } catch (error: any) {
      console.error("Error updating privacy policy:", error);
      const errorMessage =
        error?.data?.message || "Failed to update privacy policy";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const result = await deletePrivacyPolicy(id).unwrap();
      toast.success(result.message || "Privacy policy deleted successfully!");
      refetch();
    } catch (error: any) {
      console.error("Error deleting privacy policy:", error);
      const errorMessage =
        error?.data?.message || "Failed to delete privacy policy";
      toast.error(errorMessage);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (pId) {
      router.push("/dashboard/privacy-policy");
    }
  };

  // Memoized page title based on mode
  const pageTitle = useMemo(() => {
    return pId ? "Edit Privacy Policy" : "Add New Privacy Policy";
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
  if (pId && (fetchByIdError || !singlePrivacyPolicy)) {
    console.log("Fetch error or no data:", {
      fetchByIdError,
      singlePrivacyPolicy,
    });
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Privacy policy data not found</p>
        <button
          onClick={() => router.push("/dashboard/privacy-policy")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Privacy Policies
        </button>
      </div>
    );
  }

  // Prepare initial data for edit form
  const initialData =
    pId && singlePrivacyPolicy
      ? transformToFormData(singlePrivacyPolicy)
      : null;

  console.log("Initial data for form:", {
    pId,
    singlePrivacyPolicy,
    initialData,
  });

  // Determine if we should show the privacy policy list section
  const shouldShowPrivacyPolicyList = !pId; // Only show list when not in edit mode

  return (
    <div className="space-y-8">
      <DashboardPageHeaderTitle title={pageTitle} />

      {pId && initialData ? (
        // Edit Mode
        <PrivacyPolicyUpdateForm
          initialData={initialData}
          onSubmit={handleUpdateSubmit}
          isLoading={isUpdating}
          onCancel={handleCancel}
        />
      ) : (
        // Create Mode
        <>
          <PrivacyPolicyForm
            onSubmit={handleCreateSubmit}
            onCancel={handleCancel}
            isLoading={isCreating}
          />

          {/* Always show Privacy Policy Lists section when not in edit mode */}
          {shouldShowPrivacyPolicyList && (
            <>
              <DashboardPageHeaderTitle title="Privacy Policies" />
              <PrivacyPolicyLists
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

export default PrivacyPolicyContent;
