"use client";

import Image from "next/image";
import { FC } from "react";
import { useTranslations } from "next-intl";

const HeroSection: FC = () => {
  const t = useTranslations("HeroSection");
  const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";
  return (
    <div className="mx-auto max-w-[1342px] w-[95%] relative">
      <div className="rounded-3xl sm:rounded-[45px] min-h-[400px] sm:min-h-[480px] lg:min-h-[560px] w-full md:pl-8 lg:pr-0 pl-4 pr-4 md:pr-8 flex flex-col items-center justify-center bg-white/28 py-7">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full lg:gap-16">
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2 lg:mb-14 text-center lg:text-left">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[64px] font-bold leading-[130%] tracking-tight text-text-primary font-jost mb-4">
              {t("perfectGift")}
              <span className="text-[#9935E5] "> {t("youLove")}</span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg xl:text-xl text-text-primary leading-relaxed max-w-[638px] font-comme mx-auto lg:mx-0">
              {t("description")}
            </p>
          </div>

          {/* Right Column - Images */}
          <div className="w-full lg:w-1/2 relative h-[280px] sm:h-[340px] md:h-[400px] lg:h-[565px]">
            <Image
              src="/collection/hero-r.svg"
              fill
              alt="Books"
              className="object-contain drop-shadow-lg hvr-float-shadow"
              sizes=""
              priority
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className=" flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-5 w-full lg:absolute bottom-[63px]">
          <button className="relative text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full max-w-[252px] cursor-pointer">
            <div className="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-3 relative z-10 translate-y-[3px]">
              <Image
                src={"/collection/hero-b-2.svg"}
                alt="button-svg"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 transition-all duration-300 group-hover/login:scale-110"
              />
              <span className="text-white text-sm sm:text-base font-dynapuff">
                {t("chooseBook")}
              </span>
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
          <button className="font-dynapuff relative text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full max-w-[252px] cursor-pointer">
            <div className="inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-3 relative z-10 translate-y-[3px]">
              <Image
                src={"/collection/hero-b-1.svg"}
                alt="button-svg"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 transition-all duration-300 group-hover/login:scale-110"
              />
              <span className="text-white text-sm sm:text-base font-dynapuff">
                {t("generateBook")}
              </span>
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

export default HeroSection;
