"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  PrivacyPolicyFormData,
  privacyPolicySchema,
} from "@/constants/privacyPolicySchema";

interface PrivacyPolicyUpdateFormProps {
  initialData: PrivacyPolicyFormData;
  onSubmit: (data: PrivacyPolicyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PrivacyPolicyUpdateForm: React.FC<PrivacyPolicyUpdateFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [featureInputs, setFeatureInputs] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("UpdateForm received initialData:", initialData);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<PrivacyPolicyFormData>({
    resolver: zodResolver(privacyPolicySchema),
    defaultValues: {
      title: "",
      features: [],
    },
    mode: "onChange",
  });

  // Initialize form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting form values with initialData:", initialData);
      reset({
        title: initialData.title || "",
        features: initialData.features || [],
      });

      // Set feature inputs based on initial data
      if (initialData.features && initialData.features.length > 0) {
        setFeatureInputs([...initialData.features, ""]);
      } else {
        setFeatureInputs([""]);
      }

      // Trigger validation after setting values
      trigger();
    }
  }, [initialData, reset, trigger]);

  // Watch features to sync with inputs
  const watchedFeatures = watch("features") || [];

  // Sync featureInputs with watched features
  useEffect(() => {
    // Only update if features exist and are different from current inputs
    if (watchedFeatures.length > 0) {
      const currentNonEmpty = featureInputs.filter(
        (input) => input.trim() !== ""
      );
      if (JSON.stringify(currentNonEmpty) !== JSON.stringify(watchedFeatures)) {
        setFeatureInputs([...watchedFeatures, ""]);
      }
    }
  }, [watchedFeatures]);

  // Add new empty input field
  const handleAddNewInputField = () => {
    setFeatureInputs([...featureInputs, ""]);
  };

  // Update value of dynamic input field
  const handleDynamicInputChange = (index: number, value: string) => {
    const updatedInputs = [...featureInputs];
    updatedInputs[index] = value;
    setFeatureInputs(updatedInputs);

    // Update the features array based on all non-empty inputs
    const nonEmptyFeatures = updatedInputs
      .filter((input) => input.trim() !== "")
      .map((input) => input.trim());

    console.log("Updating features to:", nonEmptyFeatures);

    setValue("features", nonEmptyFeatures, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Remove dynamic input field
  const handleRemoveInputField = (index: number) => {
    if (featureInputs.length > 1) {
      const updatedInputs = featureInputs.filter((_, i) => i !== index);
      setFeatureInputs(updatedInputs);

      // Update the features array
      const nonEmptyFeatures = updatedInputs
        .filter((input) => input.trim() !== "")
        .map((input) => input.trim());

      setValue("features", nonEmptyFeatures, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Handle Enter key in feature inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === featureInputs.length - 1) {
        handleAddNewInputField();
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: PrivacyPolicyFormData) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // Error is handled by the parent component with toast
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleFormCancel = () => {
    if (initialData) {
      reset(initialData);
      // Reset feature inputs based on initial data
      if (initialData.features && initialData.features.length > 0) {
        setFeatureInputs([...initialData.features, ""]);
      } else {
        setFeatureInputs([""]);
      }
    }
    onCancel();
  };

  const isSubmitDisabled = isLoading || isSubmitting || !isDirty;
  const handleFeatureInputFocus = (index: number) => {
    // If this is the last input field and it's currently empty, add a new one
    if (
      index === featureInputs.length - 1 &&
      featureInputs[index].trim() === ""
    ) {
      handleAddNewInputField();
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6">
      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 1st Field: Title */}
        <div className="space-y-2 sm:space-y-3">
          <label className="block text-base sm:text-lg font-semibold text-gray-700">
            Privacy Policy Title
          </label>
          <input
            type="text"
            placeholder="Enter privacy policy title"
            {...register("title")}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg border rounded-lg placeholder:text-gray-400 transition-colors ${
              errors.title
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
          />
          {errors.title && (
            <p className="text-xs sm:text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 2nd Field: Features */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="block text-base sm:text-lg font-semibold text-gray-700">
              Privacy Policy Features
            </h3>

            {/* Dynamic Feature Input Fields */}
            <div className="space-y-3 sm:space-y-4">
              {featureInputs.map((inputValue, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 group">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) =>
                        handleDynamicInputChange(index, e.target.value)
                      }
                      onFocus={() => handleFeatureInputFocus(index)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      placeholder={`Type feature ${index + 1} here...`}
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg border rounded-lg placeholder:text-gray-400 transition-colors w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {featureInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInputField(index)}
                      className="p-2 sm:p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shrink-0"
                      title="Remove this field">
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.features && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.features.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddNewInputField}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-lg hover:bg-gray-200/90 rounded-lg transition">
              <div className="h-8 w-8 flex items-center justify-center bg-[#73B7FF] rounded-full">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Add new feature
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleFormCancel}
            disabled={isLoading || isSubmitting}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#73B7FF] text-white font-medium rounded-lg hover:bg-[#73B7FF]/90 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
            {isLoading || isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
                <span className="text-sm sm:text-base">Updating...</span>
              </span>
            ) : (
              "Update Privacy Policy"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivacyPolicyUpdateForm;
