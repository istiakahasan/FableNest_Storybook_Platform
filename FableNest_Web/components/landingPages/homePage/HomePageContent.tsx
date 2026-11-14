"use client";

import BestSellersSection from "./BestSellersSection";
import BrowseStoriesByAgeSection from "./BrowseStoriesByAgeSection";
import CreateBookSection from "./CreateBookSection";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import PrivacyExplain from "./PrivacyExplain";

const HomePageContent = () => {
  return (
    <div className="">
      <div className="mt-20 sm:mt-28 md:mt-32 lg:mt-[180px]">
        <HeroSection />
      </div>
      <div className="mt-20 sm:mt-28">
        <HowItWorksSection />
      </div>
      <div className="lg:mt-0 mt-20">
        <BestSellersSection />
      </div>
      <div className="lg:mt-[120px] mt-20">
        <CreateBookSection />
      </div>
      <div className="mt-20 sm:mt-28">
        <BrowseStoriesByAgeSection />
      </div>
      <div className="mt-20 sm:mt-28 lg:mt-[160px]">
        <PrivacyExplain />
      </div>
    </div>
  );
};

export default HomePageContent;
