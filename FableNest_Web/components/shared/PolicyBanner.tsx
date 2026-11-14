import Image from "next/image";
import React from "react";

interface PolicyBannerProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const PolicyBanner: React.FC<PolicyBannerProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div className="relative">
      {/* Background with gradient and decorative elements */}
      <div
        className="absolute inset-0 w-full h-full bg-white/28 rounded-[45px]"
      >

        {/* Decorative stars */}
        <div className="absolute top-16 left-32 w-5 h-5  md:block hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 0L9.79772 5.52786L15.6085 5.52786L10.9054 8.94427L12.7031 14.4721L8 11.0557L3.29686 14.4721L5.09458 8.94427L0.391441 5.52786L6.20228 5.52786L8 0Z"
              fill="#FFDC64"
            />
          </svg>
        </div>
        <div className="absolute top-24 right-40 w-5 h-5  md:block hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 0L9.79772 5.52786L15.6085 5.52786L10.9054 8.94427L12.7031 14.4721L8 11.0557L3.29686 14.4721L5.09458 8.94427L0.391441 5.52786L6.20228 5.52786L8 0Z"
              fill="#FFDC64"
            />
          </svg>
        </div>
        <div className="absolute bottom-24 left-40 w-5 h-5  md:block hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 0L9.79772 5.52786L15.6085 5.52786L10.9054 8.94427L12.7031 14.4721L8 11.0557L3.29686 14.4721L5.09458 8.94427L0.391441 5.52786L6.20228 5.52786L8 0Z"
              fill="#FFDC64"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:justify-between gap-2 sm:gap-8 md:gap-10 lg:gap-12 px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Left side - Text content */}
        <div className="text-left w-full lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Title with star decoration */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-4 h-4 sm:w-5 sm:h-5  md:block hidden">
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 0L9.79772 5.52786L15.6085 5.52786L10.9054 8.94427L12.7031 14.4721L8 11.0557L3.29686 14.4721L5.09458 8.94427L0.391441 5.52786L6.20228 5.52786L8 0Z"
                  fill="#FFDC64"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary font-jost leading-tight">
              {title}
            </h1>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-sec font-comme leading-relaxed max-w-full lg:max-w-[600px]">
            {description}
          </p>
        </div>

        {/* Right side - Image */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-shrink-0">
          <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] h-auto">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={450}
              height={450}
              className="w-full h-auto object-contain drop-shadow-lg hvr-float-shadow"
              priority={false}
              sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyBanner;

