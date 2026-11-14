"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { getBookCreationData, saveBookCreationData } from "@/utils/bookCreationData";
import { toast } from "sonner";

export default function ChildDetailsPage() {
  const t = useTranslations("ChildDetails");
  const router = useRouter();
  const [childName, setChildName] = useState(() => {
    if (typeof window !== "undefined") {
      const data = getBookCreationData();
      return data.childName || "";
    }
    return "";
  });
  const [childAge, setChildAge] = useState(() => {
    if (typeof window !== "undefined") {
      const data = getBookCreationData();
      return data.childAge || "";
    }
    return "";
  });

  const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

  const handleBack = () => {
    // Save current data before going back
    saveBookCreationData({ childName, childAge });
    router.push("/create-own-book/character");
  };

  const handleNext = () => {
    // Validate: name and age required
    if (!childName.trim()) {
      toast.error("Please enter child's name");
      return;
    }
    if (!childAge.trim()) {
      toast.error("Please enter child's age");
      return;
    }
    const ageNum = parseInt(childAge);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      toast.error("Please enter a valid age between 1 and 18");
      return;
    }

    // Save child details to localStorage
    saveBookCreationData({ childName, childAge });
    router.push("/create-own-book/photo-upload");
  };

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[100px] sm:my-[200px]">
      {/* Background with gradient and particles */}
      <div
        className="absolute inset-0"
      >
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Main Content Card */}
        <div className="bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#F28097] shadow-2xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-8 sm:mb-10">
            {t("selectChildDetails")}
          </h1>

          {/* Input Fields */}
          <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
            {/* Child's Name */}
            <div>
              <label className="block text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4">
                {t("childsName")}
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={t("enterChildsName")}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-base sm:text-lg bg-white text-[#2D2D2D]"
              />
            </div>

            {/* Child's Age */}
            <div>
              <label className="block text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4">
                {t("childsAge")}
              </label>
              <input
                type="number"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder={t("enterChildsAge")}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-base sm:text-lg bg-white text-[#2D2D2D]"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-8 sm:mt-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-[#F28097] bg-white text-[#F28097] font-semibold text-base hover:bg-[#FFF0F3] transition-all duration-300 flex items-center justify-center gap-2 font-dynapuff"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="#F28097" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{t("backToPreviousQuestion")}</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 font-dynapuff"
          >
            <div className="flex items-center justify-center gap-2 relative z-10 pointer-events-none">
              <span>{t("goToNextQuestion")}</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
            <span
              className="absolute inset-0 rounded-xl transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: gradientHover }}
            />
          </button>
        </div>
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

