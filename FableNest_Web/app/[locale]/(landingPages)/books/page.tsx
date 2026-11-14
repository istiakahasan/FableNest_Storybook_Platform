"use client";

import BookBanner from "@/components/landingPages/bookPage/BookBanner";
import BookCard from "@/components/landingPages/bookPage/BookCard";
import BrowseStoriesByAgeSection from "@/components/landingPages/homePage/BrowseStoriesByAgeSection";
import CreateBookSection from "@/components/landingPages/homePage/CreateBookSection";
import PrivacyExplain from "@/components/landingPages/homePage/PrivacyExplain";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";

export default function BooksPage() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShouldRotate(true));
    
    // Cleanup function
    return () => {
      dispatch(setShouldRotate(false));
    };
  }, [dispatch]);



  return (
    <div>
      <div className="mt-20 sm:mt-28 md:mt-32 lg:mt-[156px]">
        <BookBanner />
      </div>
      <div className="mt-10 sm:mt-[43px]">
        <BookCard />
      </div>
      <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-[120px]">
        <CreateBookSection />
      </div>
      <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-[120px]">
        <BrowseStoriesByAgeSection />
      </div>
      <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-[120px]">
        <PrivacyExplain />
      </div>
    </div>
  );
}
