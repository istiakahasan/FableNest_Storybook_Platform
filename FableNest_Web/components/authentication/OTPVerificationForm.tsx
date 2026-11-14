"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/store/api/authApi";
import toast, { Toaster } from "react-hot-toast";

const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

export default function OTPVerificationForm() {
  const t = useTranslations("OTPVerificationForm");
  const tToast = useTranslations("ToastMessages");
  const router = useRouter();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes
  const [isTimerActive, setIsTimerActive] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Get email from sessionStorage
  const getStoredEmail = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("forgotPasswordEmail") || "";
    }
    return "";
  };

  const [email] = useState<string>(getStoredEmail());

  // Redirect if no email found
  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are filled
    if (value && index === 5) {
      const finalOtp = [...newOtp];
      if (finalOtp.every((digit) => digit !== "")) {
        setTimeout(() => {
          handleVerifyOtp(finalOtp.join(""));
        }, 300);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      // Focus the last filled input or the last input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      
      // Auto-verify if all 6 digits are pasted
      if (pastedData.length === 6) {
        setTimeout(() => {
          handleVerifyOtp(pastedData);
        }, 300);
      }
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6 || !email) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const result = await verifyOtp({
        email: email,
        otp: parseInt(code, 10),
      }).unwrap();

      // Success
      if (result.success && result.data?.accessToken) {
        // Store the access token
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", result.data.accessToken);
          // Store email for reset password page
          sessionStorage.setItem("resetPasswordEmail", email);
        }
        toast.success(result.message || tToast("otpVerifiedSuccess"));
        // Redirect to reset password page
        setTimeout(() => {
          router.push("/auth/reset-password");
        }, 1000);
      }
    } catch (error: unknown) {
      // Handle error response
      const errorData = error as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.errorMessages?.[0]?.message || 
        "OTP verification failed. Please try again.";
      toast.error(errorMessage);
      // Clear OTP on error
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please go back to forgot password page.");
      return;
    }

    try {
      const result = await resendOtp({
        email: email,
      }).unwrap();

      // Success
      if (result.success) {
        toast.success(result.message || tToast("newOtpSentSuccess"));
        // Reset timer and OTP
        setOtp(Array(6).fill(""));
        setTimeLeft(300); // Reset to 5 minutes
        setIsTimerActive(true);
        inputRefs.current[0]?.focus();
      }
    } catch (error: unknown) {
      // Handle error response
      const errorData = error as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.errorMessages?.[0]?.message || 
        "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyOtp();
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
              src="/images/auth/security.png"
              alt="Security Icon"
              width={100}
              height={100}
              className="drop-shadow-lg hvr-float-shadow"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] font-jost mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-600 font-comme mb-4">
            {t("description")}
          </p>
          <div className="text-sm text-gray-600 font-comme mb-2">
            <span>{t("codeWillExpire")} </span>
            <span className={`font-semibold ${timeLeft > 0 ? "text-blue-500" : "text-red-500"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          {/* Resend OTP Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600 font-comme">Didn&apos;t receive the code? </span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || (isTimerActive && timeLeft > 0)}
              className={`text-sm font-comme font-semibold transition-colors ${
                isResending || (isTimerActive && timeLeft > 0)
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#8880F2] hover:text-[#F28097] hover:underline"
              }`}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-comme"
              />
            ))}
          </div>

          {/* Verify OTP Button */}
          <button
            type="submit"
            disabled={isVerifying || otp.join("").length !== 6}
            className="group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden font-dynapuff mt-4 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {isVerifying ? "Verifying..." : "Verify OTP"}
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

          {/* Resend OTP Button */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || (isTimerActive && timeLeft > 0)}
            className="group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden font-dynapuff mt-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {isResending ? "Sending..." : t("resetOTP")}
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
