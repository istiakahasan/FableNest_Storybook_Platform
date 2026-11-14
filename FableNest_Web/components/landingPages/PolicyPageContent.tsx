"use client";

import React from "react";
import PolicyBanner from "@/components/shared/PolicyBanner";

interface ContentSection {
  title: string;
  description: string;
}

interface PolicyPageContentProps {
  bannerTitle: string;
  bannerDescription: string;
  bannerImageSrc: string;
  bannerImageAlt: string;
  mainTitle: string;
  mainDescription: string;
  sections: ContentSection[];
}

const PolicyPageContent: React.FC<PolicyPageContentProps> = ({
  bannerTitle,
  bannerDescription,
  bannerImageSrc,
  bannerImageAlt,
  mainTitle,
  mainDescription,
  sections,
}) => {
  return (
    <div className="max-w-[1280px] mx-auto w-[95%] mt-20 sm:mt-28 md:mt-32 lg:mt-[156px]">
      <div className="">
        <div className="">
          <PolicyBanner
            title={bannerTitle}
            description={bannerDescription}
            imageSrc={bannerImageSrc}
            imageAlt={bannerImageAlt}
          />
        </div>
      </div>

      <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16">
        <div className="">
          <div
            className=""
          >
            <div className="divide-y divide-text-primary/70 mt-3 px-2">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="space-y-4 py-6 sm:py-7 md:py-8 first:pt-0 last:pb-0"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-text-primary font-jost flex items-center">
                    <span className="mr-2 font-bold">
                      {index + 1}.
                    </span>
                    <span>{section.title}</span>
                  </h3>
                  <p className="text-base sm:text-lg text-text-sec font-comme leading-relaxed">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPageContent;

