"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getBookCreationData, saveBookCreationData } from "@/utils/bookCreationData";
import { toast } from "sonner";

export default function ImageStyleSelectionPage() {
  const t = useTranslations("ImageStyleSelection");
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const data = getBookCreationData();
      return data.imageStyle || null;
    }
    return null;
  });

  const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

  const styles = [
    { key: "childrensManga", value: "Children's manga" },
    { key: "pixar3D", value: "Pixar 3D" },
    { key: "semiRealisticCartoon", value: "Semi-realistic cartoon" },
  ];

  // Get the image path for the selected style and gender
  const getSelectedStyleImage = () => {
    if (!selectedStyle) return null;
    
    const data = getBookCreationData();
    const gender = data.gender || "Boy"; // Default to Boy if not set
    const genderLower = gender === "Boy" ? "boy" : "girl";
    
    // Map style keys to image filenames
    const styleImageMap: { [key: string]: string } = {
      childrensManga: `children's-manga(${genderLower})`,
      pixar3D: `pixar-3d(${genderLower})`,
      semiRealisticCartoon: `semi-realistic-cartoon(${genderLower})`,
    };
    
    const imageName = styleImageMap[selectedStyle];
    return imageName ? `/image-styles/${imageName}.png` : null;
  };

  const handleBack = () => {
    // Save current selection before going back
    if (selectedStyle) {
      saveBookCreationData({ imageStyle: selectedStyle });
    }
    router.push("/create-own-book/photo-upload");
  };

  const handleNext = () => {
    // Validate: must select style
    if (!selectedStyle) {
      toast.error("Please select an image style");
      return;
    }
    
    // Save image style to localStorage
    saveBookCreationData({ imageStyle: selectedStyle });
    router.push("/create-own-book/language");
  };

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[100px] sm:my-[200px]">
      {/* Background with gradient and particles */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Main Content Card */}
        <div className="bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#F28097] shadow-2xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-8 sm:mb-10">
            {t("selectImageStyle")}
          </h1>

          {/* Style Selection Buttons */}
          <div className="mb-8 sm:mb-10">
            {/* Style Selection Row */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {styles.map((style) => (
                <button
                  key={style.key}
                  onClick={() => setSelectedStyle(style.key)}
                  className={`flex-1 py-3 sm:py-4 px-3 text-nowrap rounded-xl font-comme font-semibold text-sm sm:text-base transition-all ${
                    selectedStyle === style.key
                      ? "border border-[#F28097] text-[#F28097] bg-[#F280971A] shadow-md glass-card"
                      : "border hover:border-[#F28097] hover:text-[#F28097] hover:shadow-md border-text-sec bg-white hover:bg-[#F280971A]"
                  }`}
                >
                  {t(style.key)}
                </button>
              ))}
            </div>

            {/* Second Row */}
            {/* <div className="flex flex-wrap gap-4 sm:gap-6">
              {styles.slice(3).map((style) => (
                <button
                  key={style.key}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`flex-1 py-3 sm:py-4 px-3 rounded-xl font-comme font-semibold text-sm sm:text-base transition-all ${
                    selectedStyle === style.value
                      ? "border border-[#F28097] text-[#F28097] bg-[#F280971A] shadow-md glass-card"
                      : "border hover:border-[#F28097] hover:text-[#F28097] hover:shadow-md border-text-sec bg-white hover:bg-[#F280971A]"
                  }`}
                >
                  {t(style.key)}
                </button>
              ))}
            </div> */}
          </div>

          {/* Image Preview Area */}
          {getSelectedStyleImage() && (
            <div className="">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                <Image 
                  src={getSelectedStyleImage()!} 
                  alt={`${styles.find(s => s.key === selectedStyle)?.value || "Image Style"} Preview`} 
                  fill 
                  className="object-cover transition-opacity duration-300" 
                />
              </div>
            </div>
          )}
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

