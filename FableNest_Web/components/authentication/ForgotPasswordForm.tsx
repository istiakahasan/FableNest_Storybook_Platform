"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import toast, { Toaster } from "react-hot-toast";

const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

export default function ForgotPasswordForm() {
  const t = useTranslations("ForgotPasswordForm");
  const tToast = useTranslations("ToastMessages");
  const tValidation = useTranslations("ValidationErrors");
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [touched, setTouched] = useState({
    email: false,
  });

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
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

    // Mark field as touched
    const newTouched = {
      email: true,
    };
    setTouched(newTouched);

    // Validate field
    const newErrors = {
      email: validateField("email", formData.email),
    };
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    try {
      const result = await forgotPassword({
        email: formData.email,
      }).unwrap();

      // Success
      if (result.success) {
        // Store email for OTP verification page
        if (typeof window !== "undefined") {
          sessionStorage.setItem("forgotPasswordEmail", formData.email);
        }
        toast.success(result.message || tToast("otpSentSuccess"));
        // Redirect to OTP verification page
        setTimeout(() => {
          router.push("/auth/otp-verification");
        }, 1000);
      }
    } catch (error: unknown) {
      // Handle error response
      const errorData = error as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.errorMessages?.[0]?.message || 
        "Failed to send OTP. Please try again.";
      toast.error(errorMessage || tToast("userNotFound"));
    }
  };

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
          <div className="flex justify-center mb-6">
            <Image
              src="/images/auth/forget.png"
              alt="Forget Password Icon"
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
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2 font-comme">
              {t("enterEmail")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jonsnow464@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent text-sm bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-comme placeholder:text-gray-400"
            />
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden font-dynapuff mt-4 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {isLoading ? "Sending..." : t("sendOTP")}
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
