"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { getBookCreationData } from "@/utils/bookCreationData";
import { useGenerateImagesFullMutation } from "@/store/api/storyApi";
import { 
  getReferenceImageFile,
  mapImageStyleToAPI,
  mapGenderToAPI,
  saveBookCreationData,
} from "@/utils/bookCreationData";
import { toast } from "sonner";

export default function FullBookViewPage() {
  const router = useRouter();
  const [bookData, setBookData] = useState(getBookCreationData());
  const [currentPage, setCurrentPage] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [generateImagesFull] = useGenerateImagesFullMutation();

  useEffect(() => {
    const data = getBookCreationData();
    setBookData(data);
    
    if (!data.fullBookImages && !data.previewImages) {
      toast.error("No book images found");
      router.push("/create-own-book");
      return;
    }
  }, [router]);

  const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

  // Get all pages (cover + story pages)
  const getAllPages = () => {
    if (bookData.fullBookImages) {
      // Full book has pages from page 1 to page 20
      const pages: Array<{ id: number; label: string; url: string; pageKey: string }> = [];
      
      // Add cover page if available
      if (bookData.previewImages?.["page 0"]) {
        pages.push({
          id: 0,
          label: "Cover",
          url: bookData.previewImages["page 0"],
          pageKey: "page 0",
        });
      }

      // Add all story pages
      for (let i = 1; i <= 20; i++) {
        const pageKey = `page ${i}`;
        const url = bookData.fullBookImages[pageKey];
        if (url) {
          pages.push({
            id: i,
            label: `Page ${i}`,
            url,
            pageKey,
          });
        }
      }

      return pages;
    } else if (bookData.previewImages) {
      // Only preview available
      return [
        { id: 0, label: "Cover", url: bookData.previewImages["page 0"], pageKey: "page 0" },
        { id: 1, label: "Page 1", url: bookData.previewImages["page 1"], pageKey: "page 1" },
      ];
    }
    return [];
  };

  const pages = getAllPages();
  const totalPages = pages.length;

  const handleRegeneratePage = async (pageKey: string) => {
    if (!bookData.generatedStory || !bookData.page1Url) {
      toast.error("Story data not found");
      return;
    }

    setIsRegenerating(pageKey);

    try {
      const referenceImage = await getReferenceImageFile();
      if (!referenceImage) {
        toast.error("Reference image not found");
        setIsRegenerating(null);
        return;
      }

      const apiImageStyle = mapImageStyleToAPI(bookData.imageStyle);
      const apiGender = mapGenderToAPI(bookData.gender);
      const age = parseInt(bookData.childAge) || 8;

      toast.loading(`Regenerating ${pageKey}...`, { id: `regenerate-${pageKey}` });

      const result = await generateImagesFull({
        reference_image: referenceImage,
        story: JSON.stringify(bookData.generatedStory.story),
        prompt: JSON.stringify(bookData.generatedStory.prompt),
        page_connections: JSON.stringify(bookData.generatedStory.page_connections),
        gender: bookData.gender === "Boy" ? "Male" : "Female",
        age: age,
        image_style: apiImageStyle,
        page_1_url: bookData.page1Url,
        coverpage: "yes",
        sequential: "yes",
      }).unwrap();

      // Update the specific page in fullBookImages
      const updatedImages = {
        ...bookData.fullBookImages,
        ...result.image_urls,
      };

      saveBookCreationData({
        fullBookImages: updatedImages,
      });

      setBookData((prev) => ({
        ...prev,
        fullBookImages: updatedImages,
      }));

      toast.success(`${pageKey} regenerated successfully!`, { id: `regenerate-${pageKey}` });
    } catch (error: any) {
      console.error("Error regenerating page:", error);
      const errorMessage = error?.data?.message || error?.data?.error || "Failed to regenerate page.";
      toast.error(errorMessage, { id: `regenerate-${pageKey}` });
    } finally {
      setIsRegenerating(null);
    }
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#F28097]" />
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[100px] sm:my-[200px]">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Main Content Card */}
        <div className="bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#F28097] shadow-2xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-4">
              {bookData.generatedStory?.story["page 0"] || "Your Story Book"}
            </h1>
            <div className="text-center text-lg sm:text-xl text-[#2D2D2D]">
              <p className="mb-2">
                <span className="font-semibold">Name:</span> {bookData.childName}
              </p>
              <p>
                <span className="font-semibold">Age:</span> {bookData.childAge}
              </p>
            </div>
            <p className="text-center text-sm sm:text-base text-gray-600 mt-2">
              Page {currentPage + 1} of {totalPages}
            </p>
          </div>

          {/* Main Image */}
          <div className="relative w-full max-w-[562px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 mb-6 sm:mb-8">
            <div className="relative aspect-4/5 bg-gradient-to-br from-blue-50 to-pink-50">
              {pages[currentPage]?.url && (
                <Image
                  src={pages[currentPage].url}
                  alt={pages[currentPage].label}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}

              {/* Regenerate Button */}
              {bookData.fullBookImages && (
                <button
                  onClick={() => handleRegeneratePage(pages[currentPage].pageKey)}
                  disabled={isRegenerating === pages[currentPage].pageKey}
                  className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#F28097]/90 to-[#FDD69A]/90 backdrop-blur-sm text-gray-900 font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegenerating === pages[currentPage].pageKey ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Regenerate Image</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="relative mb-6 sm:mb-8">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(index)}
                  className={`shrink-0 w-24 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                    currentPage === index
                      ? "border-[#F28097] ring-2 ring-[#F28097]/20"
                      : "border-[#F28097]/30 hover:border-[#F28097]/60"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={page.url}
                      alt={page.label}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#F28097]/90 text-white text-center py-1 text-xs font-semibold">
                      {page.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-8 sm:mt-10">
          <button
            onClick={() => router.push("/")}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-[#F28097] bg-white text-[#F28097] font-semibold text-base hover:bg-[#FFF0F3] transition-all duration-300 flex items-center justify-center gap-2 font-dynapuff"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="#F28097" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

