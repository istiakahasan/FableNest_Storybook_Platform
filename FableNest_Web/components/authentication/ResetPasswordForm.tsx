"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useResetPasswordMutation } from "@/store/api/authApi";
import toast, { Toaster } from "react-hot-toast";

const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordForm");
  const tToast = useTranslations("ToastMessages");
  const tValidation = useTranslations("ValidationErrors");
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  // Initialize email from sessionStorage using lazy initializer
  const [email] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("resetPasswordEmail") || "";
    }
    return "";
  });

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "newPassword":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        return "";
      case "confirmPassword":
        if (!value) {
          return "Please confirm your password";
        }
        if (value !== formData.newPassword) {
          return "Passwords do not match";
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Validate confirm password when password changes
    if (name === "newPassword" && touched.confirmPassword) {
      const confirmPasswordError = validateField("confirmPassword", formData.confirmPassword);
      setErrors({
        ...errors,
        confirmPassword: confirmPasswordError,
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const newTouched = {
      newPassword: true,
      confirmPassword: true,
    };
    setTouched(newTouched);

    // Validate all fields
    const newErrors = {
      newPassword: validateField("newPassword", formData.newPassword),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    if (!email) {
      toast.error(tToast("emailNotFound"));
      return;
    }

    try {
      const result = await resetPassword({
        email: email,
        newPassword: formData.newPassword,
      }).unwrap();

      // Success
      if (result.success) {
        // Clear session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("forgotPasswordEmail");
          sessionStorage.removeItem("resetPasswordEmail");
        }
        toast.success(result.message || "Password reset successfully!");
        // Redirect to success page or login
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      }
    } catch (error: unknown) {
      // Handle error response
      const errorData = error as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.errorMessages?.[0]?.message || 
        tToast("passwordResetFailed");
      toast.error(errorMessage);
    }
  };

  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "";

  return (
    <div className="px-1">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      {/* Gradient Background */}
      <div className="absolute inset-0" />

      {/* Form Container */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/auth/security2.png"
              alt="Security Icon"
              width={100}
              height={100}
              className="drop-shadow-lg hvr-float-shadow"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] font-jost mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-600 font-comme">
            {t("description")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2 font-comme">
              {t("newPassword")}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="********"
                className={`w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-comme placeholder:text-gray-400 transition-colors ${
                  errors.newPassword && touched.newPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#8880F2]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && touched.newPassword && (
              <p className="mt-1 text-xs text-red-500 font-comme">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2 font-comme">
              {t("confirmPassword")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="********"
                className={`w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-comme placeholder:text-gray-400 transition-colors ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-[#8880F2]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 font-comme">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isLoading || !passwordsMatch || Object.values(errors).some((error) => error !== "")}
            className="group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden font-dynapuff mt-4 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {isLoading ? "Resetting..." : t("resetPassword")}
            </span>
            <span
              className="absolute inset-0 rounded-xl transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: gradientHover }}
            />
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-25px) translateX(15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
