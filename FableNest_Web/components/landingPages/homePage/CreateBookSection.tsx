"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const CreateBookSection = () => {
  const t = useTranslations("CreateBookSection");
  const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full"
          style={{
            backgroundImage: "url('/collection/bg-gredent.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
        </div>
      <div className="text-center mb-5 max-w-[1280px] mx-auto w-[95%] ">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jost text-text-primary">
          {t("title")}
        </h1>
        <p className=" font-comme text-text-sec text-xs sm:text-sm md:text-base mt-2 sm:mt-3 md:mt-4">
          {t("description")}
        </p>
      </div>

      <div className="relative max-w-[1280px] mx-auto w-[95%] ">

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 lg:gap-0">
            {/* Left Image - Hidden on mobile, smaller on tablet */}
            <div className="hidden sm:block lg:w-auto order-1 lg:order-1">
              <Image
                src="/collection/glob.svg"
                width={200}
                height={200}
                className="sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[280px] lg:h-[280px] xl:w-[350px] xl:h-[350px] hvr-float-shadow"
                alt="glob"
              />
            </div>

            {/* Center Content */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 w-full lg:w-auto max-w-md lg:max-w-none mx-auto order-2 lg:order-2">
              <div className="w-full bg-white/50 rounded-lg p-3 sm:p-4 h-16 sm:h-20 md:h-24 overflow-hidden">
                <div className="mb-1 sm:mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 20 20"
                    fill="none">
                    <path
                      d="M13.7375 10.7223C14.0419 10.6136 14.2462 10.3229 14.2462 9.99982C14.2462 9.6767 14.0419 9.38607 13.7387 9.27732L12.345 8.77482C11.6669 8.53156 11.0511 8.14124 10.5417 7.63185C10.0323 7.12246 9.642 6.50664 9.39874 5.82857L8.89624 4.43482C8.84247 4.28654 8.74446 4.15835 8.61547 4.06759C8.48648 3.97682 8.33272 3.92786 8.17499 3.92732C7.85249 3.92732 7.56187 4.13107 7.45187 4.43482L6.94999 5.82857C6.70679 6.50677 6.3164 7.12269 5.80689 7.6321C5.29737 8.14151 4.68137 8.53176 4.00312 8.77482L2.61062 9.27732C2.30624 9.38669 2.10187 9.6767 2.10187 9.99982C2.10187 10.3229 2.30624 10.6129 2.60937 10.7223L4.00312 11.2248C4.68123 11.468 5.29709 11.8583 5.80649 12.3677C6.31589 12.8771 6.70619 13.493 6.94937 14.1711L7.45187 15.5654C7.56124 15.8686 7.85187 16.0723 8.17437 16.0723C8.49687 16.0723 8.78749 15.8679 8.89624 15.5648L9.39874 14.1711C9.642 13.493 10.0323 12.8772 10.5417 12.3678C11.0511 11.8584 11.6669 11.4681 12.345 11.2248L13.7375 10.7223ZM11.9212 10.0486C11.0699 10.3539 10.2968 10.8438 9.65726 11.4833C9.01776 12.1228 8.52777 12.896 8.22249 13.7473L8.17374 13.8823L8.12499 13.7473C7.81952 12.8961 7.32947 12.1231 6.68999 11.4836C6.05051 10.8441 5.27745 10.354 4.42624 10.0486L4.29187 9.99982L4.42687 9.95107C5.27818 9.64579 6.05135 9.15581 6.69085 8.5163C7.33035 7.8768 7.82034 7.10363 8.12562 6.25232L8.17437 6.11732L8.22312 6.25232C8.52837 7.10355 9.01827 7.87665 9.65766 8.51615C10.297 9.15564 11.0701 9.64567 11.9212 9.95107L12.0562 9.99982L11.9212 10.0486ZM11.5925 4.6642L12.2981 4.91857C12.5987 5.02643 12.8718 5.19949 13.0976 5.42534C13.3234 5.65118 13.4965 5.9242 13.6044 6.22482L13.8581 6.92982C13.9575 7.20607 14.2212 7.3917 14.5144 7.3917C14.8075 7.3917 15.0719 7.20607 15.1706 6.93045L15.425 6.22482C15.5327 5.92413 15.7058 5.65105 15.9316 5.42519C16.1575 5.19934 16.4306 5.02632 16.7312 4.91857L17.4375 4.6642C17.7119 4.56482 17.8975 4.3017 17.8981 4.00982C17.8987 3.71795 17.715 3.45357 17.4375 3.35232L16.7312 3.09795C16.4307 2.99 16.1577 2.81692 15.9319 2.59109C15.706 2.36526 15.5329 2.09227 15.425 1.7917L15.1706 1.08607C15.1216 0.9515 15.0323 0.835266 14.915 0.753136C14.7977 0.671006 14.6579 0.626953 14.5147 0.626953C14.3715 0.626953 14.2317 0.671006 14.1144 0.753136C13.997 0.835266 13.9078 0.9515 13.8587 1.08607L13.6044 1.7917C13.4965 2.09232 13.3234 2.36534 13.0976 2.59118C12.8718 2.81702 12.5987 2.99008 12.2981 3.09795L11.5906 3.35295C11.3156 3.45295 11.1306 3.71732 11.1312 4.00982C11.1319 4.30232 11.3175 4.56545 11.5925 4.6642ZM14.515 2.7842C14.8105 3.29089 15.232 3.71248 15.7387 4.00795C15.232 4.30341 14.8105 4.725 14.515 5.2317C14.2194 4.72512 13.7978 4.30357 13.2912 4.00795C13.7977 3.71214 14.2192 3.29063 14.515 2.7842ZM17.4369 15.3354L16.7312 15.0811C16.4307 14.9731 16.1577 14.8 15.9319 14.5742C15.706 14.3484 15.5329 14.0754 15.425 13.7748L15.1706 13.0692C15.1214 12.9347 15.0321 12.8185 14.9147 12.7365C14.7973 12.6544 14.6576 12.6104 14.5144 12.6104C14.3712 12.6104 14.2314 12.6544 14.114 12.7365C13.9966 12.8185 13.9073 12.9347 13.8581 13.0692L13.6037 13.7748C13.496 14.0755 13.323 14.3486 13.0971 14.5744C12.8713 14.8003 12.5982 14.9733 12.2975 15.0811L11.5925 15.3348C11.3169 15.4336 11.1312 15.6973 11.1306 15.9898C11.13 16.2823 11.3144 16.5467 11.5919 16.6473L12.2975 16.9017C12.5982 17.0094 12.8713 17.1824 13.0972 17.4082C13.3231 17.6341 13.4961 17.9072 13.6037 18.2079L13.8575 18.9129C13.9064 19.0479 13.9956 19.1645 14.1131 19.247C14.2306 19.3294 14.3706 19.3737 14.5141 19.3738C14.6577 19.3738 14.7977 19.3297 14.9153 19.2474C15.0329 19.165 15.1222 19.0485 15.1712 18.9136L15.4256 18.2079C15.5336 17.9074 15.7066 17.6344 15.9325 17.4086C16.1583 17.1827 16.4313 17.0096 16.7319 16.9017L17.4406 16.6467C17.715 16.5461 17.8994 16.2823 17.8987 15.9898C17.8981 15.6973 17.7119 15.4348 17.4369 15.3354ZM14.515 17.2154C14.2195 16.7087 13.7979 16.2872 13.2912 15.9917C13.7978 15.6961 14.2194 15.2745 14.515 14.7679C14.8106 15.2745 15.2322 15.6961 15.7387 15.9917C15.2322 16.2873 14.8106 16.7089 14.515 17.2154Z"
                      fill="#636F85"
                    />
                  </svg>
                </div>
                <textarea
                  className="w-full resize-none outline-none text-xs sm:text-sm md:text-base bg-transparent"
                  placeholder={t("writeStoryIdea")}
                  rows={2}></textarea>
              </div>

              <div className="w-full">
                <div className="relative">
                  <div className="absolute bottom-0 -left-10 sm:-left-16 md:-left-20 lg:-left-[105px] z-10">
                    <Image
                      src="/collection/simp.svg"
                      width={80}
                      height={80}
                      className="w-0 h-0 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[100px] lg:h-[100px] xl:w-[130px] xl:h-[130px] hvr-float-shadow"
                      alt="smiling face"
                    />
                  </div>
                  <div className="w-full">
                    <Image
                      src="/collection/baby.svg"
                      width={350}
                      height={190}
                      className="w-full h-auto"
                      alt="baby character"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              <button className="relative font-dynapuff cursor-pointer px-4 py-2.5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden border border-white w-full">
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                  <span className="text-white">{t("createOwnBook")}</span>
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

            {/* Right Image - Hidden on mobile, smaller on tablet */}
            <div className="hidden sm:block lg:w-auto order-3 lg:order-3">
              <Image
                src="/collection/witch.svg"
                width={200}
                height={200}
                className="sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[280px] lg:h-[280px] xl:w-[350px] xl:h-[350px] hvr-float-shadow"
                alt="witch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBookSection;
