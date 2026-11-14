"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getBookCreationData } from "@/utils/bookCreationData";
import { toast } from "sonner";

export default function BookPreviewPage() {
  const router = useRouter();
  const [bookData] = useState(() => getBookCreationData());

  useEffect(() => {
    // Check if preview images exist
    if (!bookData.previewImages || !bookData.previewImages["page 0"]) {
      toast.error("No preview images found. Please create your book first.");
      router.push("/create-own-book/story-idea");
      return;
    }
  }, [router, bookData.previewImages]);

  const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

  // Show cover image from API response
  const coverImageUrl = bookData.previewImages?.["page 0"];

  const handleProceedToPayment = () => {
    // Navigate to checkout/payment page
    router.push("/checkout");
  };

  const handleBack = () => {
    router.push("/create-own-book/story-idea");
  };

  if (!bookData.previewImages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#F28097]" />
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[100px] sm:my-[200px]">
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Main Content Card */}
        <div className="bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#F28097] shadow-2xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-6 sm:mb-8">
            Preview Your Story Book
          </h1>

          {/* Book Info */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl text-[#2D2D2D] mb-2">
              <span className="font-semibold">Name:</span> {bookData.childName}
            </p>
            <p className="text-lg sm:text-xl text-[#2D2D2D] mb-2">
              <span className="font-semibold">Age:</span> {bookData.childAge}
            </p>
            <p className="text-lg sm:text-xl text-[#2D2D2D]">
              <span className="font-semibold">Story Title:</span> {bookData.storyIdea || "Your Story"}
            </p>
          </div>

          {/* Preview Image - Cover */}
          <div className="relative w-full max-w-[562px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-6 sm:mb-8">
            <div className="relative aspect-4/5 bg-gradient-to-br from-blue-50 to-pink-50">
              {coverImageUrl && (
                <Image
                  src={coverImageUrl}
                  alt="Book Cover"
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 sm:mb-8">
            <p className="text-center text-sm sm:text-base text-[#2D2D2D]">
              This is a preview of your story book. Complete payment to generate the full book with all pages and unlock regeneration features.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-8 sm:mt-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-[#F28097] bg-white text-[#F28097] font-semibold text-base hover:bg-[#FFF0F3] transition-all duration-300 flex items-center justify-center gap-2 font-dynapuff"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="#F28097" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
          </button>

          {/* Proceed to Payment Button */}
          <button
            onClick={handleProceedToPayment}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 font-dynapuff"
          >
            <div className="flex items-center justify-center gap-2 relative z-10 pointer-events-none">
              <span>Proceed to Payment</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
            <span
              className="absolute inset-0 rounded-xl transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: gradientHover }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

