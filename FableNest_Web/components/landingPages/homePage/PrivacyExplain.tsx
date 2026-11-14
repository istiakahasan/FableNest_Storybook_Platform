"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const PrivacyExplain = () => {
  const t = useTranslations("PrivacyExplain");
  return (
    <>
      <div className="relative">
        <div
          className="absolute inset-0 w-full"
          style={{
            backgroundImage: "url('/collection/bg-gredent.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
        </div>

        <div className="relative max-w-[1280px] mx-auto w-[95%]">
          {/* Mobile/Tablet: Stack layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Title section */}
            <div className="text-left w-full lg:w-1/2">
              <h2 className="text-[#7C3AED73] text-sm sm:text-base md:text-lg font-medium font-jost uppercase tracking-wide mb-2 sm:mb-3">
                {t("privacyExplanation")}
              </h2>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-jost text-text-primary lg:text-4xl xl:text-[48px] font-bold leading-tight sm:leading-tight md:leading-tight mb-3 sm:mb-4 md:mb-6">
                {t("weCareAboutPrivacy")}
              </h1>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-full lg:max-w-[600px] font-comme text-text-sec">
                {t("privacyDescription")}
              </p>
            </div>

            {/* Image section - Adjusts for different screen sizes */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <Image
                src={"/collection/poster.svg"}
                alt="Privacy protection illustration"
                width={400}
                height={400}
                className="w-[300px] lg:w-[350px] xl:w-[400px] h-auto hvr-float-shadow"
                priority={false}
                sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 400px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Balloon image - responsive positioning */}
      <div className="flex justify-center">
        <Image
          src={"/collection/balloon.svg"}
          alt="Decorative balloon"
          width={130}
          height={130}
          className="w-[70px] sm:w-[90px] md:w-[110px] lg:w-[130px] h-auto hvr-float-shadow"
        />
      </div>
    </>
  );
};

export default PrivacyExplain;
