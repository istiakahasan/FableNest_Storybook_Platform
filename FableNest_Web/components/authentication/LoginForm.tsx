"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLoginMutation } from "@/store/api/authApi";
import toast, { Toaster } from "react-hot-toast";

const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

export default function LoginForm() {
  const t = useTranslations("LoginForm");
  const tToast = useTranslations("ToastMessages");
  const tValidation = useTranslations("ValidationErrors");
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form data with remembered email and password if exists
  const getInitialEmail = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rememberedEmail") || "";
    }
    return "";
  };
  
  const getInitialPassword = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rememberedPassword") || "";
    }
    return "";
  };
  
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("rememberedEmail");
    }
    return false;
  });
  const [formData, setFormData] = useState({
    email: getInitialEmail(),
    password: getInitialPassword(),
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Store referrer when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if referrer is already stored (from Navbar click)
      const existingReferrer = sessionStorage.getItem("loginReferrer");
      
      if (!existingReferrer) {
        // Get the referrer from document.referrer
        const referrer = document.referrer;
        
        if (referrer) {
          try {
            const referrerUrl = new URL(referrer);
            const referrerPath = referrerUrl.pathname;
            
            // Only store if it's not an auth page
            if (!referrerPath.includes("/auth/")) {
              sessionStorage.setItem("loginReferrer", referrerPath);
            } else {
              // If coming from auth page, use home as default
              sessionStorage.setItem("loginReferrer", "/");
            }
          } catch {
            // If URL parsing fails, use home as default
            sessionStorage.setItem("loginReferrer", "/");
          }
        } else {
          // No referrer, use home as default
          sessionStorage.setItem("loginReferrer", "/");
        }
      }
    }
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          return tValidation("emailRequired");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return tValidation("emailInvalid");
        }
        return "";
      case "password":
        if (!value) {
          return tValidation("passwordRequired");
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
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
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      setTouched({
        ...touched,
        [name]: true,
      });

      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const newTouched = {
      email: true,
      password: true,
    };
    setTouched(newTouched);

    // Validate all fields
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Success
      if (result.success && result.data?.accessToken) {
        // Store the access token
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", result.data.accessToken);
          if (rememberMe) {
            // Store email and password for remember me functionality
            localStorage.setItem("rememberedEmail", formData.email);
            localStorage.setItem("rememberedPassword", formData.password);
          } else {
            // Remove remembered email and password if remember me is unchecked
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
          }
          // Dispatch custom event to update navbar
          window.dispatchEvent(new Event("auth-change"));
        }
        // toast.success(result.message || "User logged in successfully!");
        // Redirect to login success page (referrer is already stored in useEffect)
        router.push("/auth/login-success");
      }
    } catch (error: unknown) {
      // Handle error response
      const errorData = error as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.errorMessages?.[0]?.message || 
        tToast("loginFailed");
      toast.error(errorMessage);
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
              src="/images/auth/fingerprint-lock.png"
              alt="Login Icon"
              width={100}
              height={100}
              className="drop-shadow-lg hvr-float-shadow"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] font-jost">
            {t("title")}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2 font-comme">
              {t("emailAddress")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="jonsnow464@gmail.com"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-comme placeholder:text-gray-400 transition-colors ${
                errors.email && touched.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-[#8880F2]"
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500 font-comme">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2 font-comme">
              {t("password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="1423566"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent text-sm bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-comme placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forget Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[#8880F2]"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-white font-comme cursor-pointer"
              >
                {t("rememberMe")}
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-500 hover:underline font-comme"
            >
              {t("forgetPassword")}
            </Link>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden font-dynapuff mt-4 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {isLoading ? "Logging in..." : t("logIn")}
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

          {/* Footer Text */}
          <p className="text-center text-sm text-white font-comme">
            {t("dontHaveAccount")}{" "}
            <Link href="/auth/signup" className="text-white hover:underline font-semibold underline">
              {t("signUp")}
            </Link>
          </p>
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
