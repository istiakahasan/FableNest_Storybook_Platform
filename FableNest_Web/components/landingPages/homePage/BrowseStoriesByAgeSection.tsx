"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

interface AgeCardProps {
  ageGroup: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
}

const AgeCard: React.FC<AgeCardProps> = ({
  ageGroup,
  imageUrl,
  buttonText,
}) => {
  const t = useTranslations("BrowseStoriesByAge");
  const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  return (
    <div className="relative group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageUrl}
          alt={`Background for ${ageGroup}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 md:p-8">
        {/* Top Section - Age */}
        <div className="space-y-1 sm:space-y-2 text-center">
          <h3 className="text-base sm:text-lg md:text-xl font-medium text-white tracking-tight font-jost">
            {t("age")}
          </h3>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight font-jost">
            {ageGroup}
          </h3>
        </div>

        {/* Bottom Section - Button */}
        <div className="flex justify-center">
          <button className="relative cursor-pointer font-dynapuff px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden w-fit">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10">
              <span className="text-white">{buttonText}</span>
            </div>
            <span
              className="absolute inset-0 rounded-lg transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
              style={{ background: gradientHover }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const BrowseStoriesByAgeSection = () => {
  const t = useTranslations("BrowseStoriesByAge");
  const cardsData = [
    {
      ageGroup: "2-4",
      title: t("discover"),
      description:
        "Play-based learning for toddlers. Interactive activities that stimulate curiosity and early development.",
      imageUrl: "/collection/b-baby.png",
      buttonText: t("discover"),
    },
    {
      ageGroup: "5-7",
      title: t("discover"),
      description:
        "Building foundational skills. Engaging lessons in math, language, and creative arts for young minds.",
      imageUrl: "/collection/b-baby2.png",
      buttonText: t("discover"),
    },
    {
      ageGroup: "8-10",
      title: t("discover"),
      description:
        "Advanced exploration and skill development. Project-based learning for growing intellects.",
      imageUrl: "/collection/b-baby3.png",
      buttonText: t("discover"),
    },
  ];
  return (
    <div className="max-w-[1280px] mx-auto w-[95%]">
      {/* Title section */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-[#7C3AED73] font-jost text-sm sm:text-base md:text-lg font-semibold uppercase tracking-wide mb-2">
          {t("ageSelection")}
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold font-jost text-text-primary leading-tight">
          {t("browseStoriesByAge")}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardsData.map((card, index) => (
          <AgeCard
            key={index}
            ageGroup={card.ageGroup}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
            buttonText={card.buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseStoriesByAgeSection;
