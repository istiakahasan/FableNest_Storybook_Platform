"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

interface SuccessAuthFormProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  redirectPath?: string;
}

export default function SuccessAuthForm({
  title,
  subtitle,
  buttonText = "Continue",
  redirectPath = "/auth/login",
}: SuccessAuthFormProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get referrer from sessionStorage (check signupReferrer, loginReferrer, and logoutReferrer)
    const storedSignupReferrer = typeof window !== "undefined" 
      ? sessionStorage.getItem("signupReferrer") 
      : null;
    const storedLoginReferrer = typeof window !== "undefined" 
      ? sessionStorage.getItem("loginReferrer") 
      : null;
    const storedLogoutReferrer = typeof window !== "undefined" 
      ? sessionStorage.getItem("logoutReferrer") 
      : null;
    
    // Priority: 
    // For signup success: signupReferrer > default redirectPath
    // For login success: logoutReferrer > loginReferrer > default redirectPath
    // This ensures if user logged out from a route, they go back there after login
    const storedReferrer = storedSignupReferrer || storedLogoutReferrer || storedLoginReferrer;
    
    // Clean the referrer - remove domain if present, keep only path
    let targetPath = redirectPath;
    if (storedReferrer) {
      try {
        // If it's a full URL, extract pathname
        if (storedReferrer.startsWith("http")) {
          const url = new URL(storedReferrer);
          targetPath = url.pathname;
        } else {
          // It's already a path
          targetPath = storedReferrer;
        }
      } catch {
        // If parsing fails, use the stored value as is or fallback
        targetPath = storedReferrer.startsWith("/") ? storedReferrer : redirectPath;
      }
    }
    
    // If no referrer found, default to home
    if (!targetPath || targetPath === "/auth/login" || targetPath === "/auth/signup") {
      targetPath = "/";
    }

    // Animate progress bar from 0 to 100% over 3 seconds using requestAnimationFrame for smooth animation
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);

    // Redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      // Clean up sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("signupReferrer");
        sessionStorage.removeItem("loginReferrer");
        sessionStorage.removeItem("logoutReferrer");
      }
      router.push(targetPath);
    }, duration);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router, redirectPath]);

  const handleContinue = () => {
    // Get referrer from sessionStorage (check signupReferrer, loginReferrer, and logoutReferrer)
    const storedSignupReferrer = typeof window !== "undefined" 
      ? sessionStorage.getItem("signupReferrer") 
      : null;
    const storedLoginReferrer = typeof window !== "undefined" 
      ? sessionStorage.getItem("loginReferrer") 
      : null;
    const storedLogoutReferrer = typeof window !== "undefined" 
      ? sessionStorage.getItem("logoutReferrer") 
      : null;
    
    // Priority: 
    // For signup success: signupReferrer > default redirectPath
    // For login success: logoutReferrer > loginReferrer > default redirectPath
    // This ensures if user logged out from a route, they go back there after login
    const storedReferrer = storedSignupReferrer || storedLogoutReferrer || storedLoginReferrer;
    let targetPath = storedReferrer || redirectPath;
    
    // If no referrer found or referrer is an auth page, default to home
    if (!targetPath || targetPath === "/auth/login" || targetPath === "/auth/signup") {
      targetPath = "/";
    }
    
    // Clean up sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("signupReferrer");
      sessionStorage.removeItem("loginReferrer");
      sessionStorage.removeItem("logoutReferrer");
    }
    
    router.push(targetPath);
  };

  return (
    <div className="px-1 overflow-hidden">
      {/* Green Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200/30 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/50"
          style={{ 
            width: `${progress}%`,
            transition: "none"
          }}
        />
      </div>
      
      {/* Gradient Background */}
      <div className="absolute inset-0" />

      {/* Form Container */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/auth/successAuth.png"
              alt="Success Icon"
              width={100}
              height={100}
              className="drop-shadow-lg hvr-float-shadow"
            />
          </div>
          <h2 className="text-3xl sm:text-[32px] font-bold text-[#2D2D2D] font-jost sm:mb-3">
            {title}
          </h2>
          <p className="text-sm text-gray-600 font-comme">
            {subtitle}
          </p>
        </div>

        {/* Continue Button */}
        {/* <button
          type="button"
          onClick={handleContinue}
          className="group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden font-dynapuff mt-4 shadow-lg hover:shadow-xl"
        >
          <span className="relative z-10">{buttonText}</span>
          <span
            className="absolute inset-0 rounded-xl transition-all duration-300"
            style={{ background: gradientInitial }}
          />
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: gradientHover }}
          />
        </button> */}
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
