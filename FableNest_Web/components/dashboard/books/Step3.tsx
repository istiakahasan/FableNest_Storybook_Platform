"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Download, MoveLeft } from "lucide-react";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import { useRouter } from "next/navigation";

interface Thumbnail {
  id: string | number;
  label: string;
}

const Step3 = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isScrolledLeft, setIsScrolledLeft] = useState<boolean>(false);
  const [isScrolledRight, setIsScrolledRight] = useState<boolean>(true);
  const totalPages = 20;
  const viewportRef = useRef<HTMLDivElement>(null);

  const thumbnails: Thumbnail[] = [
    { id: "front", label: "Front Cover" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
    { id: 4, label: "4" },
    { id: 5, label: "5" },
    { id: 6, label: "6" },
    { id: 7, label: "7" },
    { id: 8, label: "8" },
    { id: 9, label: "9" },
    { id: 18, label: "18" },
    { id: 19, label: "19" },
    { id: 16, label: "16" },
    { id: 17, label: "17" },
  ];

  // Check scroll position for showing/hiding gradients
  const checkScrollPosition = () => {
    if (viewportRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
      setIsScrolledLeft(scrollLeft > 0);
      setIsScrolledRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const container = viewportRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition(); // Initial check
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);
  const gradientInitial =
    "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const handleThumbnailClick = (id: string | number) => {
    if (typeof id === "number") {
      setCurrentPage(id);
    }
    // Handle front cover click if needed
    if (id === "front") {
      setCurrentPage(1);
    }
  };

  const handleChangeClick = () => {
    console.log("Change button clicked");
    // Implement change functionality
  };

  const handleDownloadClick = () => {
    console.log("Download button clicked");
    // Implement download functionality
  };

  const handleRegenerateClick = () => {
    console.log("Regenerate image clicked");
    // Implement regenerate functionality
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (viewportRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      viewportRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto w-[95%] sm:w-full">
      <DashboardPageHeaderTitle title="Book preview & edit" />

      <div className="flex flex-col items-center gap-6 self-stretch p-4 sm:p-6 md:p-8 rounded-2xl border border-[#F28097] bg-white/70 backdrop-blur-lg mt-12 mb-6 shadow-lg w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-6">
          <div className="flex-1 w-full min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              The Adventure of Rakib to the Amazon Jungle
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-sm sm:text-base text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <strong className="font-semibold text-gray-800">Name:</strong>
                <span className="text-gray-600">Rakib</span>
              </span>
              <span className="flex items-center gap-2">
                <strong className="font-semibold text-gray-800">Age:</strong>
                <span className="text-gray-600">11</span>
              </span>
            </div>
            <div className="text-sm sm:text-base text-gray-700">
              <span className="font-semibold text-gray-800">
                Page {currentPage}
              </span>
              <span className="text-gray-500"> of {totalPages}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={handleChangeClick}
              className="px-5 sm:px-6 py-3 rounded-xl border-2 border-[#F28097] bg-white text-[#F28097] text-sm sm:text-base font-semibold hover:bg-[#F28097]/10 active:bg-[#F28097]/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F28097] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              aria-label="Change story details">
              Change
            </button>
            <button
              onClick={handleDownloadClick}
              className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full sm:w-auto order-1 sm:order-2">
              <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
                <Download className="text-white" />
                <span className="text-white">Download</span>
              </div>
              <span
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{ background: gradientHover }}
              />
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                style={{ background: gradientInitial }}
              />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#F28097]" />

        {/* Main Image Section */}
        <div className="relative w-full max-w-[562px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          <div className="relative aspect-4/5 bg-linear-to-br from-blue-50 to-pink-50">
            <Image
              src="/collection/b-baby2.png"
              alt={`Story page ${currentPage}`}
              className="w-full h-full object-cover"
              width={562}
              height={650}
              unoptimized
            />

            {/* Regenerate Image Button - Fixed positioning */}
            <button
              onClick={handleRegenerateClick}
              className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-br from-[#F28097]/90 to-[#FDD69A]/90 backdrop-blur-sm text-gray-900 font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 shadow-lg"
              aria-label="Regenerate this image">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <g clipPath="url(#clip0_28498_3946)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.875 21.0518V23.25C19.875 23.664 20.2125 24 20.625 24C21.0375 24 21.375 23.664 21.375 23.25V20.25C21.3743 19.7531 21.1775 19.2766 20.8275 18.924C20.4752 18.5724 19.9978 18.3749 19.5 18.375H16.5C16.0875 18.375 15.75 18.711 15.75 19.125C15.75 19.539 16.0875 19.875 16.5 19.875H18.9412C17.0925 21.5081 14.6625 22.5 12 22.5C6.20625 22.5 1.5 17.7952 1.5 12C1.5 11.586 1.1625 11.25 0.75 11.25C0.3375 11.25 0 11.586 0 12C0 18.6229 5.3775 24 12 24C15.0112 24 17.7675 22.8878 19.875 21.0518ZM9.99 5.89012L8.9175 8.73525C8.90178 8.77706 8.87723 8.81498 8.84552 8.84643C8.81381 8.87788 8.77568 8.90213 8.73375 8.9175L5.89125 9.99C5.055 10.3054 4.5 11.106 4.5 12C4.5 12.894 5.055 13.6946 5.89125 14.01L8.73375 15.0825C8.77568 15.0979 8.81381 15.1221 8.84552 15.1536C8.87723 15.185 8.90178 15.2229 8.9175 15.2648L9.99 18.1099C10.305 18.9465 11.1075 19.5 12 19.5C12.8925 19.5 13.695 18.9465 14.01 18.1099L15.0825 15.2648C15.0984 15.2234 15.1226 15.1857 15.1537 15.1541C15.1862 15.1232 15.2245 15.0988 15.2662 15.0825L18.1087 14.01C18.945 13.6946 19.5 12.894 19.5 12C19.5 11.106 18.945 10.3054 18.1087 9.99L15.2662 8.9175C15.2245 8.90115 15.1862 8.87683 15.1537 8.84587C15.1226 8.81429 15.0984 8.77663 15.0825 8.73525L14.01 5.89012C13.695 5.0535 12.8925 4.5 12 4.5C11.1075 4.5 10.305 5.0535 9.99 5.89012ZM11.3925 6.41925C11.49 6.16687 11.73 6 12 6C12.27 6 12.51 6.16687 12.6075 6.41925L13.68 9.26437C13.7707 9.50517 13.9113 9.72408 14.0925 9.90675C14.2756 10.0891 14.4955 10.2302 14.7375 10.3207L17.58 11.3936C17.835 11.4889 18 11.7304 18 12C18 12.2696 17.835 12.5111 17.58 12.6064L14.7375 13.6793C14.4955 13.7698 14.2756 13.9109 14.0925 14.0933C13.9113 14.2759 13.7707 14.4948 13.68 14.7356L12.6075 17.5807C12.51 17.8331 12.27 18 12 18C11.73 18 11.49 17.8331 11.3925 17.5807L10.32 14.7356C10.2293 14.4948 10.0887 14.2759 9.9075 14.0933C9.72442 13.9109 9.50452 13.7698 9.2625 13.6793L6.42 12.6064C6.165 12.5111 6 12.2696 6 12C6 11.7304 6.165 11.4889 6.42 11.3936L9.2625 10.3207C9.50452 10.2302 9.72442 10.0891 9.9075 9.90675C10.0887 9.72408 10.2293 9.50517 10.32 9.26437L11.3925 6.41925ZM4.125 2.94825V0.75C4.125 0.336 3.7875 0 3.375 0C2.9625 0 2.625 0.336 2.625 0.75V3.75C2.62574 4.24686 2.82248 4.72336 3.1725 5.076C3.5248 5.42763 4.00225 5.62508 4.5 5.625H7.5C7.9125 5.625 8.25 5.289 8.25 4.875C8.25 4.461 7.9125 4.125 7.5 4.125H5.05875C6.9075 2.49187 9.3375 1.5 12 1.5C17.7938 1.5 22.5 6.20475 22.5 12C22.5 12.414 22.8375 12.75 23.25 12.75C23.6625 12.75 24 12.414 24 12C24 5.37713 18.6225 0 12 0C8.98875 0 6.2325 1.11225 4.125 2.94825Z"
                    fill="#2D2D2D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_28498_3946">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>Regenerate Image</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Navigation with shadcn ScrollArea */}
        <div className="w-full">
          <div className="relative">
            {/* Scroll buttons for desktop */}
            {isScrolledLeft && (
              <button
                onClick={() => scrollThumbnails("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-r-lg p-2 shadow-lg hover:bg-white transition-colors hidden sm:flex items-center justify-center"
                aria-label="Scroll thumbnails left">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {isScrolledRight && (
              <button
                onClick={() => scrollThumbnails("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-l-lg p-2 shadow-lg hover:bg-white transition-colors hidden sm:flex items-center justify-center"
                aria-label="Scroll thumbnails right">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Scroll gradients for mobile */}
            {isScrolledLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent pointer-events-none z-10 sm:hidden" />
            )}

            {isScrolledRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent pointer-events-none z-10 sm:hidden" />
            )}

            <ScrollArea className="w-full">
              <div ref={viewportRef} className="flex items-center gap-3 pb-4">
                {thumbnails.map((thumb) => {
                  const isCurrent =
                    currentPage === thumb.id ||
                    (thumb.id === "front" && currentPage === 1);
                  return (
                    <button
                      key={thumb.id}
                      onClick={() => handleThumbnailClick(thumb.id)}
                      className={`shrink-0 w-24 h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F28097] focus:ring-offset-2 ${
                        isCurrent
                          ? "border-[#F28097] ring-2 ring-[#F28097]/20"
                          : "border-[#F28097]/30 hover:border-[#F28097]/60"
                      }`}
                      aria-label={`Go to ${thumb.label}`}
                      aria-current={isCurrent ? "page" : undefined}>
                      <div className="relative w-full h-full">
                        <div className="w-full h-20 bg-linear-to-br from-blue-100 to-pink-100">
                          <Image
                            src={`/collection/b-baby.png`}
                            alt={`Page ${thumb.label}`}
                            className="w-full h-full object-cover"
                            width={96}
                            height={80}
                            unoptimized
                          />
                        </div>
                        <div
                          className={`absolute bottom-0 left-0 right-0 ${
                            isCurrent ? "bg-[#F28097]" : "bg-[#F28097]/90"
                          } text-white text-center py-2 text-xs font-semibold truncate px-2`}>
                          {thumb.label}
                        </div>
                        {isCurrent && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Thumbnail navigation hint for mobile */}
          <div className="text-center text-xs text-gray-500 mt-2 sm:hidden">
            ← Scroll to see more →
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 w-full">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 border border-[#F28097] text-[#F28097] rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-pink-50 transition-colors w-full sm:w-auto order-2 sm:order-1">
            <div className="w-4 h-4 sm:w-5 sm:h-5">
              <MoveLeft className="w-full h-full" />
            </div>
            <span className="whitespace-nowrap">Back To Previews Page</span>
          </button>

          <button className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full sm:w-auto order-1 sm:order-2">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
              <span className="text-white">Add This Book Now</span>
            </div>
            <span
              className="absolute inset-0 rounded-lg transition-all duration-300"
              style={{ background: gradientHover }}
            />
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
              style={{ background: gradientInitial }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
