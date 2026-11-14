"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { toast } from "sonner";

// Define Zod schema for password validation
const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required")
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z
    .string()
    .min(1, "New password is required")
    .min(6, "New password must be at least 6 characters"),
});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Initial form data
const initialFormData: PasswordChangeFormData = {
  currentPassword: "",
  newPassword: "",
};

const ChangePasswordForm = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Use the mutation hook
  const [changePasswordAction, { isLoading }] = useChangePasswordMutation();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  // Handle form submission with actual mutation
  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      // Call the actual mutation
      const response = await changePasswordAction({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (response.success) {
        toast.success("Password changed successfully!");
        reset(initialFormData);
      }
    } catch (error: any) {
      console.error("Error changing password:", error);

      // Handle different error formats
      let errorMessage = "Failed to change password. Please try again.";
      toast.error(errorMessage);
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset(initialFormData);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
        <p className="text-gray-600 mt-2">
          Update your password to keep your account secure
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password Fields Container - Flex row on large screens */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Old Password Field */}
          <div className="flex-1 flex flex-col space-y-2">
            <label
              htmlFor="oldPassword"
              className="text-lg font-medium text-gray-700">
              Old Password
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                {...register("currentPassword")}
                className={`w-full border rounded-lg h-14 px-4 text-lg placeholder:text-gray-400 pr-12 transition-colors ${
                  errors.currentPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showOldPassword ? "Hide password" : "Show password"}
                disabled={isLoading}>
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="flex-1 flex flex-col space-y-2">
            <label
              htmlFor="newPassword"
              className="text-lg font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("newPassword")}
                className={`w-full border rounded-lg h-14 px-4 text-lg placeholder:text-gray-400 pr-12 transition-colors ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                disabled={isLoading}>
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons - Centered */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading || !isDirty}
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="px-6 py-3 bg-[#73B7FF] text-white font-medium rounded-lg hover:bg-[#73B7FF]/90 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
