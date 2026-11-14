"use client";

import { books } from "@/constants/landingPageData";
import PersonalizedBestsellerCarousel from "./ThreeDCarousel";
import Image from "next/image";
import { useTranslations } from "next-intl";

const BestSellersSection = () => {
  const t = useTranslations("BestSellersSection");
  const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";
  return (
    <div className="w-full lg:pt-20">
      {/* Title section */}
      <div className="max-w-[1280px] w-[95%] mx-auto">
        {/* Subtitle with icon */}
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <Image
            src="/collection/fly.png"
            alt="Decorative flying icon"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <h2 className="text-[#8A38F5] text-sm sm:text-base md:text-lg font-semibold uppercase tracking-wide ">
            {t("bestsellers")}
          </h2>
        </div>

        {/* Main title and button row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 ">
          {/* Title with magic wand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold leading-tight text-text-primary font-jost">
              {t("personalizeBestseller")}
            </h1>
            <Image
              src="/collection/magic-stick.svg"
              alt="Magic wand icon"
              width={95}
              height={95}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain hvr-float-shadow"
            />
          </div>

          {/* View All Button */}
          <button
            className="relative cursor-pointer inline-flex items-center justify-center gap-2 z-10 translate-y-[3px] px-4 sm:px-5 md:px-6 py-2 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 overflow-hidden border border-white shadow-lg hover:shadow-xl active:scale-[0.98] group w-fit mt-4 sm:mt-0"
            aria-label="View all bestsellers">
            <span className="relative z-10 text-white font-dynapuff">{t("viewAll")}</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path 
                d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" 
                fill="white"
              />
            </svg>
            {/* Initial gradient background */}
            <span
              className="absolute inset-0 rounded-lg transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            {/* Hover gradient overlay */}
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: gradientHover }}
            />
          </button>
        </div>
      </div>
      <PersonalizedBestsellerCarousel items={books} />
    </div>
  );
};

export default BestSellersSection;
