"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ChangePasswordForm from "./ChangePasswordForm";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/dashboardApi";
import { toast } from "sonner";

// Updated Zod schema - using firstName and lastName instead of fullName
const adminInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type AdminInfoFormData = z.infer<typeof adminInfoSchema>;

// Updated initial form data - removed fullName, added firstName and lastName
const initialFormData: AdminInfoFormData = {
  firstName: "",
  lastName: "",
  email: "",
};

const AdminInfoContent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    "/images/dashboard/admin-info-pro.jpg"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useGetProfileQuery();
  const [updateProfileAction] = useUpdateProfileMutation();

  const email = data?.data.email || "";
  const firstName = data?.data.firstName || "";
  const lastName = data?.data.lastName || "";
  const initialProfileImage =
    data?.data.profileImage || "/images/dashboard/admin-info-pro.jpg";

  // Initialize profile image preview from query data
  useEffect(() => {
    if (initialProfileImage) {
      setProfileImagePreview(initialProfileImage);
    }
  }, [initialProfileImage]);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<AdminInfoFormData>({
    resolver: zodResolver(adminInfoSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  // Populate form with data from query when component mounts
  useEffect(() => {
    if (data?.data) {
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", email);
    }
  }, [data, setValue, firstName, lastName, email]);

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.warning("Image size should be less than 5MB");
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);

    // Store the file and preview URL
    setProfileImageFile(file);
    setProfileImagePreview(imageUrl);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const onSubmit = async (formData: AdminInfoFormData) => {
    setIsSubmitting(true);
    try {
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);

      // Append profile image if a new file was selected
      if (profileImageFile) {
        formDataToSend.append("profileImage", profileImageFile);
      } else if (profileImagePreview !== initialProfileImage) {
        // If the image preview has changed but we don't have a file
        // (e.g., it was a URL change), we need to handle this differently
        // For now, we'll append the URL as a string
        formDataToSend.append("profileImageUrl", profileImagePreview);
      }

      console.log("Submitting FormData with fields:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        hasProfileImageFile: !!profileImageFile,
        profileImagePreview,
      });

      // Call the update profile mutation with FormData
      await updateProfileAction(formDataToSend).unwrap();

      // Refetch the profile data to get updated information
      await refetch();

      // Clear the file state after successful upload
      if (profileImageFile) {
        setProfileImageFile(null);
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // Handle specific error messages from the API
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        error?.data?.error ||
        "Failed to update profile. Please try again.";

      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form to original query data
    if (data?.data) {
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", email);
    }

    // Reset profile image to original
    setProfileImagePreview(initialProfileImage);
    setProfileImageFile(null);

    // Clear any file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsEditing(false);
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Trigger file input click
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-center">
        {/* Profile photo skeleton */}
        <div className="flex justify-center mb-8 w-full">
          <div className="relative">
            {/* Circular profile image skeleton with shimmer */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full border-4 border-[#D5D5D5] overflow-hidden bg-gray-200 relative">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Form skeleton */}
        <div className="space-y-6 w-full">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* First Name Field Skeleton */}
            <div className="flex flex-col space-y-2">
              <div className="h-7 rounded w-28 overflow-hidden bg-gray-200 relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="border border-[#D5D5D5] rounded-lg h-14 overflow-hidden bg-gray-50 relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-gray-200/60 to-transparent"></div>
              </div>
            </div>

            {/* Last Name Field Skeleton */}
            <div className="flex flex-col space-y-2">
              <div className="h-7 rounded w-28 overflow-hidden bg-gray-200 relative">
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent"
                  style={{ animationDelay: "0.1s" }}></div>
              </div>
              <div className="border border-[#D5D5D5] rounded-lg h-14 overflow-hidden bg-gray-50 relative">
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-gray-200/60 to-transparent"
                  style={{ animationDelay: "0.1s" }}></div>
              </div>
            </div>
          </div>

          {/* Email Field Skeleton */}
          <div className="flex flex-col space-y-2">
            <div className="h-7 rounded w-20 overflow-hidden bg-gray-200 relative">
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent"
                style={{ animationDelay: "0.2s" }}></div>
            </div>
            <div className="border border-[#D5D5D5] rounded-lg h-14 overflow-hidden bg-gray-50 relative">
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-gray-200/60 to-transparent"
                style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <div className="h-12 rounded-lg w-full sm:w-48 overflow-hidden bg-gray-300 relative">
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent"
                style={{ animationDelay: "0.3s" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-center">
        {/* Profile photo */}
        <div className="flex justify-center mb-8 w-full">
          <div className="relative group">
            {/* Profile Image Container */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 overflow-hidden rounded-full border-4 border-[#D5D5D5]">
              <Image
                src={profileImagePreview}
                alt="Admin profile"
                fill
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 256px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />

              {/* Image overlay on hover */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium px-3 text-center">
                    Change Photo
                  </span>
                </div>
              )}
            </div>

            {/* Camera Button - Only show when editing */}
            {isEditing && (
              <>
                <button
                  type="button"
                  className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 bg-white px-2 py-1.5 rounded shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#73B7FF] focus:ring-offset-2"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleCameraClick}
                  disabled={isSubmitting}
                  aria-label="Change profile picture">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#68b0fc]" />

                  {/* Tooltip */}
                  {isHovered && !isSubmitting && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                      Upload new photo
                      <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </button>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting}
                />
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* First Name Field */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="firstName"
                className="text-lg font-medium text-gray-700">
                First Name:
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                disabled={!isEditing || isSubmitting}
                {...register("firstName")}
                className={`border rounded-lg h-14 px-4 text-lg placeholder:text-[#B6BEC8] transition-colors ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#D5D5D5] focus:ring-blue-500 focus:border-blue-500"
                } ${
                  !isEditing || isSubmitting
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="lastName"
                className="text-lg font-medium text-gray-700">
                Last Name:
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                disabled={!isEditing || isSubmitting}
                {...register("lastName")}
                className={`border rounded-lg h-14 px-4 text-lg placeholder:text-[#B6BEC8] transition-colors ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#D5D5D5] focus:ring-blue-500 focus:border-blue-500"
                } ${
                  !isEditing || isSubmitting
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field - Always disabled (not editable) */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700">
              Email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              disabled={true} // Always disabled - not editable
              {...register("email")}
              className="border border-[#D5D5D5] rounded-lg h-14 px-4 text-lg placeholder:text-[#B6BEC8] bg-gray-50 cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-8 py-3 bg-[#00244A] text-white font-medium rounded-lg hover:bg-[#00244A]/90 transition-colors focus:outline-none ">
                Edit Information
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!isDirty && !profileImageFile)}
                  className="px-8 py-3 bg-[#73B7FF] text-white font-medium rounded-lg hover:bg-[#73B7FF]/90 transition-colors focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Password section */}
      <ChangePasswordForm />
    </div>
  );
};

export default AdminInfoContent;
