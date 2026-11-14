import React, { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "yellow" | "purple" | "red" | "green"; // default variants
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "yellow" }) => {
  const colors = {
    yellow: "bg-[#FFBB001A] text-[#FFBB00] border-[#FFBB00]",
    purple: "bg-[#9935E51A] text-[#9935E5] border-[#9935E5]",
    red: "bg-[#FF008C1A] text-[#FF008C] border-[#FF008C]",
    green: "bg-[#00FF441A] text-[#00FF44] border-[#00FF44]",
  };
  return (
    <div
      className={`rounded-[76px] border-[0.5px] py-2 px-3 font-semibold text-xs w-fit ${colors[variant]}`}>
      {children}
    </div>
  );
};

export default Badge;
