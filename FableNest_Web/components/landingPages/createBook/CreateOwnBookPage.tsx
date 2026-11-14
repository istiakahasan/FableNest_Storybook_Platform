"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";



export default function CreateOwnBookPage() {
  const t = useTranslations("CreateOwnBookPage");
  const router = useRouter();

  const handleCreateBook = () => {
    router.push("/create-own-book/character");
  };

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[150px] sm:my-[200px] lg:my-[250px]">
      {/* Background with gradient and particles */}
      <div
        className="absolute inset-0"

      >

      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        {/* Central Card */}
        <button
          onClick={handleCreateBook}
          className="w-full bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-dashed border-[#F28097] hover:border-[#e06d8a] transition-all cursor-pointer"
        >
          {/* Plus Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="100" height="100" rx="50" fill="#F28097" fillOpacity="0.1"/>
<path d="M50 25.625C36.56 25.625 25.625 36.56 25.625 50C25.625 63.44 36.56 74.375 50 74.375C63.44 74.375 74.375 63.44 74.375 50C74.375 36.56 63.44 25.625 50 25.625ZM50 29.375C61.4131 29.375 70.625 38.5869 70.625 50C70.625 61.4131 61.4131 70.625 50 70.625C38.5869 70.625 29.375 61.4131 29.375 50C29.375 38.5869 38.5869 29.375 50 29.375ZM48.125 38.75V48.125H38.75V51.875H48.125V61.25H51.875V51.875H61.25V48.125H51.875V38.75H48.125Z" fill="#F28097"/>
</svg>

          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-4 sm:mb-6">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl font-jost text-[#2D2D2D] text-center">
            {t("subtitle")}
          </p>
        </button>
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
      `}</style>
    </div>
  );
}

