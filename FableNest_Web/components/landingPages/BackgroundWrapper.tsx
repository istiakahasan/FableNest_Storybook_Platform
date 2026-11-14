"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";

interface BackgroundWrapperProps {
  children: ReactNode;
  className?: string;
}

const BackgroundWrapper = ({
  children,
  className = "",
}: BackgroundWrapperProps) => {
  const shouldRotate = useAppSelector((state) => state.background.shouldRotate);

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: shouldRotate ? `rotate(180deg) scale(1)` : "none",
          transformOrigin: "center center",
        }}
        autoPlay
        loop
        muted
      >
        <source src="https://i.imgur.com/P5qBT0z.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
