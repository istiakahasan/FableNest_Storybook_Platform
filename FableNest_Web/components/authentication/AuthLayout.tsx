"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding Section */}
      <div className="hidden lg:flex w-[50%] bg-[#fafafa81] items-center justify-center relative">        
        <div className="w-[50%] mx-auto">
          {/* Logo Image */}
          <div className="w-full h-[520px] mx-auto">
            <Image
              src="/images/auth/glowLogo.png"
              alt="Face2Toon Logo"
              fill
              className="object-contain mx-auto w-full h-[520px] hvr-float-shadow"
              priority
            />
          </div>
        
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 relative w-[50%] min-h-screen flex items-center justify-center">
        {/* Background Image/GIF */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.imgur.com/P5qBT0z.gif"
            alt="Background"
            fill
            className="object-cover w-full"
            priority
            unoptimized
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 "></div>
        </div>

        {/* Form Content */}
        <div className="relative z-10 w-[95%] max-h-screen overflow-y-auto sm:py-10 py-5 max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

