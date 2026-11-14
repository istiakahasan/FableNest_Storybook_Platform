"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useAddPromoMutation,
  useGetPromoDetailsQuery,
  useUpdatePromoMutation,
} from "@/store/api/promoApi";
import { useParams } from "next/navigation";

// Updated Zod schema with all fields required
const promoCodeSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .regex(
        /^[A-Z0-9]+$/,
        "Code must contain only uppercase letters and numbers"
      )
      .max(50, "Code cannot exceed 50 characters"),

    discount: z
      .string()
      .min(1, "Discount is required")
      .regex(/^\d+$/, "Discount must be a valid number")
      .refine((val) => parseInt(val, 10) >= 1, "Discount must be at least 1%")
      .refine((val) => parseInt(val, 10) <= 100, "Discount cannot exceed 100%"),

    useLimit: z.string().min(1, "Use limit is required"),

    minOrder: z
      .string()
      .min(1, "Minimum order is required")
      .regex(/^\d*\.?\d+$/, "Minimum order must be a valid number")
      .refine(
        (val) => parseFloat(val) >= 0,
        "Minimum order must be at least 0"
      ),

    startTime: z.date({
      error: "Start time is required",
    }),

    endTime: z.date({
      error: "End time is required",
    }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

// Define form data type (what we expect after transformation)
type PromoCodeFormData = {
  code: string;
  discount: number;
  useLimit: string;
  minOrder: number;
  startTime: Date;
  endTime: Date;
};

// Define raw form data type (what react-hook-form sees)
type RawFormData = {
  code: string;
  discount: string;
  useLimit: string;
  minOrder: string;
  startTime: Date;
  endTime: Date;
};

// --- Reusable Components ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField: React.FC<InputProps> = ({
  label,
  className,
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700 mb-1.5 sm:text-base">
        {label}
      </label>
      <input
        className={`
          w-full px-3 py-2.5 sm:px-4 sm:py-3 
          text-sm sm:text-base
          border rounded-lg 
          placeholder:text-gray-400 
          transition-all duration-200
          focus:outline-none focus:ring-2 
          ${
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-[#73B7FF]"
          } 
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

const CreatePromoCodeForm = () => {
  const params = useParams();
  const promoId = params.id as string;
  const isEditMode = !!promoId;

  // Fetch existing data if in edit mode
  const { data: promoData, isLoading: isLoadingData } = useGetPromoDetailsQuery(
    promoId,
    { skip: !isEditMode }
  );
  const existingPromo = promoData?.data;
  // Mutations
  const [addPromo, { isLoading: isAdding }] = useAddPromoMutation();
  const [updatePromo, { isLoading: isUpdating }] = useUpdatePromoMutation();

  const isLoading = isAdding || isUpdating || isLoadingData;

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<RawFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      discount: "",
      useLimit: "",
      minOrder: "",
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
    mode: "onChange",
  });

  // Auto-populate form when existing data is fetched
  useEffect(() => {
    if (isEditMode && existingPromo) {
      // Transform the API response to match the form structure
      const formattedData: RawFormData = {
        code: existingPromo.code || "",
        discount: existingPromo.discountValue?.toString() || "",
        minOrder: existingPromo.minimumAmount?.toString() || "",
        startTime: existingPromo.startTime
          ? new Date(existingPromo.startTime)
          : new Date(),
        endTime: existingPromo.endTime
          ? new Date(existingPromo.endTime)
          : new Date(new Date().setHours(new Date().getHours() + 1)),
        useLimit: (() => {
          // Convert useLimit to string value
          const useLimit = existingPromo.useLimit;
          if (useLimit === 0) return "Unlimited";
          return useLimit?.toString() || "";
        })(),
      };

      reset(formattedData);
    }
  }, [existingPromo, isEditMode, reset]);

  const onSubmit = async (rawData: RawFormData) => {
    try {
      // Transform string values to numbers
      const data: PromoCodeFormData = {
        ...rawData,
        discount: parseInt(rawData.discount, 10),
        minOrder: parseFloat(rawData.minOrder),
      };

      // Format dates to ISO strings
      const payload = {
        // ...(isEditMode && { id: promoId }), // Include ID for update nahian
        code: data.code,
        discountValue: data.discount,
        minimumAmount: data.minOrder,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        useLimit:
          data.useLimit.toLowerCase() === "unlimited"
            ? 0
            : parseInt(data.useLimit, 10) || 0,
      };

      if (isEditMode) {
        // Update existing promo
        await updatePromo({ body: payload, id: promoId }).unwrap();
        alert("Promo code updated successfully!");

        // Optionally redirect back to promo list
        // router.push("/dashboard/promos");
      } else {
        // Create new promo
        await addPromo(payload).unwrap();
        alert("Promo code created successfully!");

        // Reset form after successful creation
        reset({
          code: "",
          discount: "",
          useLimit: "",
          minOrder: "",
          startTime: new Date(),
          endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Show error message from API if available
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        `Failed to ${
          isEditMode ? "update" : "create"
        } promo code. Please try again.`;
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      );
      if (confirmed) {
        if (isEditMode && existingPromo) {
          // Reset to original data
          const formattedData: RawFormData = {
            code: existingPromo.code || "",
            discount: existingPromo.discountValue?.toString() || "",
            minOrder: existingPromo.minimumAmount?.toString() || "",
            startTime: existingPromo.startTime
              ? new Date(existingPromo.startTime)
              : new Date(),
            endTime: existingPromo.endTime
              ? new Date(existingPromo.endTime)
              : new Date(new Date().setHours(new Date().getHours() + 1)),
            useLimit: (() => {
              const useLimit = existingPromo.useLimit;
              if (useLimit === 0) return "Unlimited";
              return useLimit?.toString() || "";
            })(),
          };
          reset(formattedData);
        } else {
          // Reset to empty form
          reset({
            code: "",
            discount: "",
            useLimit: "",
            minOrder: "",
            startTime: new Date(),
            endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
          });
        }
        console.log("Form cancelled and reset");
      }
    } else {
      if (isEditMode) {
        // If no changes were made, just log
        console.log("Form cancelled - no changes were made");
      } else {
        // For create mode, reset to empty
        reset({
          code: "",
          discount: "",
          useLimit: "",
          minOrder: "",
          startTime: new Date(),
          endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        });
      }
    }
  };

  // Watch date fields for custom validation
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Determine button text based on mode
  const getSubmitButtonText = () => {
    if (isLoading) {
      return isEditMode ? "Updating..." : "Saving...";
    }
    return isEditMode ? "Update Promo Code" : "Save Promo Code";
  };

  // Determine header title based on mode
  const getHeaderTitle = () => {
    return isEditMode ? "Edit promo code" : "Create new promo code";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <DashboardPageHeaderTitle title={getHeaderTitle()} />

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/50 overflow-hidden">
        <form
          className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate>
          {isLoadingData && isEditMode ? (
            // Loading state for edit mode
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading promo data...</p>
            </div>
          ) : (
            <>
              {/* Code Field */}
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="code"
                    label="Promo Code"
                    type="text"
                    placeholder="e.g., SUMMER2024"
                    error={errors.code?.message}
                    value={field.value}
                    onChange={(e) => {
                      // Auto-uppercase the code
                      field.onChange(e.target.value.toUpperCase());
                    }}
                    onBlur={field.onBlur}
                    disabled={isLoading}
                  />
                )}
              />

              {/* Discount Field */}
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="discount"
                    label="Discount Percentage"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g., 20"
                    error={errors.discount?.message}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers
                      if (value === "" || /^\d+$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={field.onBlur}
                    disabled={isLoading}
                  />
                )}
              />

              {/* Use Limit Field (Replaced Select with Input) */}
              <Controller
                name="useLimit"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="useLimit"
                    label="Use Limit"
                    type="text"
                    placeholder="Enter number or 'Unlimited'"
                    error={errors.useLimit?.message}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow numbers or the word "Unlimited"
                      if (value === "" || /^\d*$|^Unlimited$/i.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={field.onBlur}
                    disabled={isLoading}
                  />
                )}
              />

              {/* Minimum Order Amount */}
              <Controller
                name="minOrder"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="minOrder"
                    label="Minimum Order Amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 100.00"
                    error={errors.minOrder?.message}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow numbers and decimal point
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={field.onBlur}
                    disabled={isLoading}
                  />
                )}
              />

              {/* Date Pickers - Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Start Time */}
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:text-base">
                        Start Time
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) =>
                            field.onChange(date || new Date())
                          }
                          onBlur={field.onBlur}
                          selectsStart
                          startDate={startTime}
                          endDate={endTime}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy HH:mm"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          placeholderText="Select date and time"
                          className={`
                              w-full px-3 py-2.5 sm:px-4 sm:py-3
                              text-sm sm:text-base
                              border rounded-lg
                              placeholder:text-gray-400
                              transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${
                                errors.startTime
                                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500/20 focus:border-[#73B7FF]"
                              }
                              ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                              }
                            `}
                          wrapperClassName="w-full"
                          disabled={isLoading}
                          popperClassName="custom-datepicker-popper"
                          calendarClassName="custom-datepicker-calendar"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.startTime && (
                        <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                          <svg
                            className="w-4 h-4 mt-0.5 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{errors.startTime.message}</span>
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* End Time */}
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:text-base">
                        End Time
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={field.value}
                          onChange={(date: Date | null) =>
                            field.onChange(date || new Date())
                          }
                          onBlur={field.onBlur}
                          selectsEnd
                          startDate={startTime}
                          endDate={endTime}
                          minDate={startTime || new Date()}
                          dateFormat="dd/MM/yyyy HH:mm"
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          placeholderText="Select date and time"
                          className={`
                              w-full px-3 py-2.5 sm:px-4 sm:py-3
                              text-sm sm:text-base
                              border rounded-lg
                              placeholder:text-gray-400
                              transition-all duration-200
                              focus:outline-none focus:ring-2
                              ${
                                errors.endTime
                                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                  : "border-gray-300 focus:ring-blue-500/20 focus:border-[#73B7FF]"
                              }
                              ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                              }
                            `}
                          wrapperClassName="w-full"
                          disabled={isLoading}
                          popperClassName="custom-datepicker-popper"
                          calendarClassName="custom-datepicker-calendar"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.endTime && (
                        <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-start gap-1">
                          <svg
                            className="w-4 h-4 mt-0.5 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{errors.endTime.message}</span>
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="
                        w-full sm:w-auto
                        px-5 py-2.5 sm:px-6 sm:py-3
                        text-sm sm:text-base font-medium
                        text-gray-700 bg-white
                        border border-gray-300 rounded-lg
                        hover:bg-gray-50 hover:border-gray-400
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                      ">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        w-full sm:w-auto
                        px-5 py-2.5 sm:px-6 sm:py-3
                        text-sm sm:text-base font-medium
                        text-white bg-[#73B7FF]
                        rounded-lg
                        hover:bg-[#5FA5ED]
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#73B7FF]
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-sm hover:shadow-md
                      ">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
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
                        <span>{getSubmitButtonText()}</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>{getSubmitButtonText()}</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePromoCodeForm;
