"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const HowItWorksSection = () => {
  const t = useTranslations("HowItWorks");

  const stepsData = [
    {
      id: 1,
      icon: "/collection/h-1.svg",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      id: 2,
      icon: "/collection/h-2.svg",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      id: 3,
      icon: "/collection/h-3.svg",
      title: t("step3Title"),
      description: t("step3Desc"),
    },
  ];
  return (
    <section className="max-w-[1280px] w-[95%] mx-auto">
      {/* Title section */}
      <div className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16">
        <h2 className="text-[#5f2aa5] text-sm sm:text-base md:text-lg font-semibold uppercase mb-2 tracking-[8%] leading-[150%]">
          {t("title")}
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-text-primary font-jost mb-10">
          {t("subtitle")}
        </h1>
      </div>

      {/* Steps cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
        {stepsData.map((step, index) => (
          <div
            key={step.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <Image
                src={step.icon}
                alt={`Step ${index + 1}: ${step.title}`}
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hvr-float-shadow"
              />
            </div>

            {/* Content */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-text-primary font-jost">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed text-text-sec font-comme">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
