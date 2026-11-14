"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Printer, Loader2, RotateCcw } from "lucide-react";
import { BookData } from "./bookData";
import { useTranslations } from "next-intl";
import { useCreateFirstTwoPagesMutation, useRegeneratePageMutation } from "@/store/api/bookApi";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { 
  getBookCreationData, 
  saveBookCreationData,
} from "@/utils/bookCreationData";
import { toast } from "sonner";

interface BookPreviewProps {
  book?: BookData; // Optional for create-own-book flow
  childName?: string;
  age?: string;
  language?: string;
  gender?: string;
}



export default function BookPreview({ book, childName, age, gender }: BookPreviewProps) {
  const t = useTranslations("BookPreview");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generation states
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [generatedPages, setGeneratedPages] = useState<{ [key: string]: string } | null>(null);
  const [previewImages, setPreviewImages] = useState<{ "page 0": string; "page 1": string } | null>(null);
  const [bookCreationData] = useState(getBookCreationData());

  const [createFirstTwoPages] = useCreateFirstTwoPagesMutation();
  const [regeneratePage] = useRegeneratePageMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Check if this is from create-own-book flow (has bookId means book was created via API)
  const isCreateOwnBook = bookCreationData.bookId !== undefined;

  // Use API response data if available, otherwise fallback to bookCreationData or props
  const displayChildName = isCreateOwnBook 
    ? (bookCreationData.apiCharacterName || bookCreationData.childName) 
    : (childName || "Rakib");
  const displayAge = isCreateOwnBook 
    ? (bookCreationData.apiCharacterAge?.toString() || bookCreationData.childAge) 
    : (age || "6");
  const displayGender = isCreateOwnBook ? (bookCreationData.gender || "Boy") : (gender || "");
  const displayBookTitle = isCreateOwnBook 
    ? (bookCreationData.bookTitle || bookCreationData.storyIdea || "Your Story") 
    : (book?.title || "");

  const [updatedChildName, setUpdatedChildName] = useState(displayChildName);
  const [updatedAge, setUpdatedAge] = useState(displayAge);
  const [updatedGender, setUpdatedGender] = useState(displayGender);

  // Total pages - always 28 pages
  const totalPages = 28;
  // Show pages based on payment status and available data
  // If not paid: show cover (page 0) and first page (page 1) if available, otherwise just cover
  // If paid: show all pages
  const visiblePages = isPaid 
    ? totalPages 
    : (isCreateOwnBook && previewImages?.["page 1"]) ? 2 : 1;

  // Load preview images on mount if from create-own-book flow
  useEffect(() => {
    if (isCreateOwnBook && !previewImages) {
      // Check if we already have preview images (coverImageUrl from API)
      if (bookCreationData.previewImages) {
        setPreviewImages(bookCreationData.previewImages);
        return;
      }
    }
  }, [isCreateOwnBook, bookCreationData.previewImages, previewImages]);

  // Generate full book after payment
  useEffect(() => {
    const generateFullBook = async () => {
      if (isPaid && isCreateOwnBook && !generatedPages && !isGeneratingFull && bookCreationData.bookId) {
        setIsGeneratingFull(true);
        try {
          toast.loading("Generating full book...", { id: "generate-full-book" });

          const result = await createFirstTwoPages(bookCreationData.bookId).unwrap();

          if (result.success && result.data) {
            // Save all pages from API response
            const allPages: { [key: string]: string } = {};
            
            // Process imageData array from API response
            if (result.data.imageData && Array.isArray(result.data.imageData)) {
              result.data.imageData.forEach((pageData) => {
                // Use fullPageUrl if available, otherwise use leftUrl or rightUrl
                if (pageData.fullPageUrl) {
                  allPages[pageData.name] = pageData.fullPageUrl;
                } else if (pageData.leftUrl) {
                  allPages[pageData.name] = pageData.leftUrl;
                }
              });
            }

            setGeneratedPages(allPages);
            saveBookCreationData({
              fullBookImages: allPages,
            });

            toast.success("Full book generated successfully!", { id: "generate-full-book" });
          } else {
            throw new Error(result.message || "Failed to generate full book");
          }
        } catch (error: unknown) {
          console.error("Error generating full book:", error);
          const errorData = error as { data?: { message?: string; error?: string } };
          const errorMessage = errorData?.data?.message || errorData?.data?.error || "Failed to generate full book.";
          toast.error(errorMessage, { id: "generate-full-book" });
        } finally {
          setIsGeneratingFull(false);
        }
      }
    };

    generateFullBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid, isCreateOwnBook]);

  // Get pages - use generated images if available, otherwise use book data
  const getPages = () => {
    if (isCreateOwnBook) {
      // Use generated images
      const pages: Array<{ id: number; label: string; image: string }> = [];
      
      // Cover page (from coverImageUrl)
      if (previewImages?.["page 0"]) {
        pages.push({
          id: 0,
          label: t("frontCover"),
          image: previewImages["page 0"],
        });
      }

      // First page (from firstPage.fullPageUrl if available)
      if (previewImages?.["page 1"] && !isPaid) {
        pages.push({
          id: 1,
          label: "1",
          image: previewImages["page 1"],
        });
      }

      // Story pages
      if (isPaid && generatedPages) {
        // Full book generated - show all pages
        for (let i = 1; i <= totalPages; i++) {
          const pageKey = `page ${i}`;
          const url = generatedPages[pageKey];
          if (url) {
            pages.push({
              id: i,
              label: i.toString(),
              image: url,
            });
          }
        }
      }
      // If not paid, only cover and first page are shown, other pages will be locked

      return pages;
    } else {
      // Regular book - use book data
      if (!book) {
        return [];
      }
      return Array.from({ length: totalPages }, (_, i) => ({
        id: i,
        label: i === 0 ? t("frontCover") : (i + 1).toString(),
        image: i === 0 ? book.image : book.gallery?.[i % (book.gallery?.length || 1)] || book.image,
      }));
    }
  };

  const pages = getPages();

  // Redirect if no data available
  useEffect(() => {
    if (!isCreateOwnBook && !book) {
      // No book data and not from create-own-book flow
      router.push("/books");
    } else if (isCreateOwnBook && !bookCreationData.previewImages) {
      // Create-own-book flow but no preview images (coverImageUrl) yet
      router.push("/create-own-book/story-idea");
    }
  }, [isCreateOwnBook, book, bookCreationData.previewImages, router]);

  const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  
  const scrollThumbnails = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePayment = () => {
    // Navigate to checkout for actual payment
    router.push("/checkout");
  };

  // Handle add to cart and navigate to cart page
  const handleAddToCart = async () => {
    if (!isCreateOwnBook || !bookCreationData.bookId) {
      toast.error("Book ID not found. Please create your book first.");
      return;
    }

    try {
      toast.loading("Adding to cart...", { id: "add-to-cart" });
      
      const result = await addToCart({ bookId: bookCreationData.bookId }).unwrap();

      if (result.success) {
        toast.success(result.message || "Item added to cart successfully!", { id: "add-to-cart" });
        // Navigate to cart page
        router.push("/cart");
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
      const errorData = error as { data?: { message?: string }; message?: string };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.message || 
        "Failed to add to cart. Please try again.";
      toast.error(errorMessage, { id: "add-to-cart" });
    }
  };

  // Handle payment success (called from payment success page)
  useEffect(() => {
    const checkPaymentStatus = () => {
      // Check if payment was successful (you can use URL params or localStorage)
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get("payment") === "success";
      
      if (paymentSuccess || localStorage.getItem("paymentSuccess") === "true") {
        setIsPaid(true);
        localStorage.removeItem("paymentSuccess");
      }
    };

    checkPaymentStatus();
  }, []);

  const handleContinue = () => {
    // Skip/Continue functionality - for now just close success modal
    setShowPaymentSuccess(false);
  };

  const handleSaveChildInfo = () => {
    setShowChangeModal(false);
  };

  // Show loading if no pages
  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F28097] mx-auto mb-4" />
          <p className="text-[#2D2D2D] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const handleRegeneratePage = async (pageIndex: number) => {
    if (!isCreateOwnBook || !bookCreationData.bookId) {
      toast.error("Book data not found");
      return;
    }

    const pageKey = pageIndex === 0 ? "page 0" : `page ${pageIndex}`;
    setIsRegenerating(pageKey);

    try {
      toast.loading(`Regenerating ${pageKey}...`, { id: `regenerate-${pageKey}` });

      // Call regenerate API
      const result = await regeneratePage(bookCreationData.bookId).unwrap();

      if (result.success && result.data) {
        // Update the specific page in generatedPages
        const updatedPages = { ...generatedPages };
        
        // Update based on pageName from response
        if (result.data.pageName) {
          // Use fullPageUrl if available, otherwise use leftUrl or rightUrl
          if (result.data.fullPageUrl) {
            updatedPages[result.data.pageName] = result.data.fullPageUrl;
          } else if (result.data.leftUrl) {
            updatedPages[result.data.pageName] = result.data.leftUrl;
          }
        }

        setGeneratedPages(updatedPages);
        
        // Update bookCreationData with new page
        saveBookCreationData({
          fullBookImages: updatedPages,
        });

        toast.success(`Page ${result.data.pageName} regenerated successfully!`, { id: `regenerate-${pageKey}` });
      } else {
        throw new Error(result.message || "Failed to regenerate page");
      }
    } catch (error: unknown) {
      console.error("Error regenerating page:", error);
      const errorData = error as { data?: { message?: string; error?: string } };
      const errorMessage = errorData?.data?.message || errorData?.data?.error || "Failed to regenerate page.";
      toast.error(errorMessage, { id: `regenerate-${pageKey}` });
    } finally {
      setIsRegenerating(null);
    }
  };

  return (
    <div className="relative max-w-[1280px] mx-auto w-[95%] lg:mt-[170px] md:mt-[150px] sm:mt-[100px] mt-20">
      {/* Background with gradient and particles */}
      <div
        className="absolute inset-0"
      >

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary font-jost mb-1 flex items-center gap-2">
            {t("bookPreviewEdit")} <Image src="/collection/bookPreview&Edit.png" alt="book" width={27} height={27} />
          </h1>
          <p className="text-sm sm:text-base text-text-sec font-comme mt-2">{displayBookTitle}</p>
        </div>

        {/* Main White Card Container */}
        <div className="bg-[#FFFFFF80] rounded-2xl shadow-lg p-6 sm:p-8 border border-[#F28097]">
          {/* Book Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-2 border-b border-[#F28097]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-jost mb-2">
                {displayBookTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-text-sec font-comme">
                <span>{t("name")}: <span className="font-semibold text-[#2D2D2D]">{updatedChildName}</span></span>
                <span>{t("age")}: <span className="font-semibold text-[#2D2D2D]">{updatedAge}</span></span>
              </div>
              <p className="text-sm lg:text-base text-[#636F85] font-comme mt-1">
                {t("page")} {currentPage + 1} {t("of")} {totalPages}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowChangeModal(true)}
                className="px-5 py-2.5 rounded-lg border-2 font-dynapuff border-[#F28097] text-[#F28097] font-semibold text-sm hover:bg-pink-50 transition-colors"
              >
                {t("change")}
              </button>
              {!isPaid ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="relative px-4 sm:px-6 py-2.5 sm:py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="inline-flex items-center justify-center gap-2 relative z-10">
                    {isAddingToCart ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 text-white" />
                    )}
                    <span className="text-white text-sm sm:text-lg">
                      {isAddingToCart ? "Adding..." : t("paySeeEverything")}
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
              ) : (
                <button
                  className="relative px-4 sm:px-6 py-2.5 sm:py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
                >
                  <div className="inline-flex items-center justify-center gap-2 relative z-10">
                    <Printer className="w-4 h-4 text-white" />
                    <span className="text-white text-sm sm:text-lg">{t("savePrint")}</span>
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
              )}
            </div>
          </div>

          {/* Main Book Cover/Page Display */}
          <div className="relative w-full mx-auto mb-6">
            <div className="w-full rounded-xl">
              {(() => {
                const currentImageUrl = pages[currentPage]?.image || "";
                // Check if image URL ends with "0.png" (0 before the dot)
                const isZeroPng = currentImageUrl.includes("/0.png") || currentImageUrl.endsWith("0.png");
                // Conditionally set image dimensions
                const imageWidth = isZeroPng ? 700 : 700;
                const imageHeight = isZeroPng ? 700 : 700;
                
                return (
                  <Image
                    src={currentImageUrl}
                    alt={`Page ${currentPage + 1}`}
                    width={imageWidth}
                    height={imageHeight}
                    className={`object-cover mx-auto rounded ${isZeroPng ? "w-[542px] h-[542px]" : "w-[700px] h-[700px] w-full h-full px-16"}`}
                    unoptimized={isCreateOwnBook} // Unoptimized for external API images
                    priority
                  />
                );
              })()}
            </div>
            {/* Regenerate Button Overlay - Only show for create-own-book after payment */}
            {isCreateOwnBook && isPaid && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => handleRegeneratePage(currentPage)}
                  disabled={isRegenerating === (currentPage === 0 ? "page 0" : `page ${currentPage}`)}
                  className="relative px-4 sm:px-6 py-2.5 sm:py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="inline-flex items-center justify-center gap-2 relative z-10">
                    {isRegenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                        <span className="text-white text-sm sm:text-lg">Regenerating...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-5 h-5 text-white" />
                        <span className="text-white text-sm sm:text-lg">{t("regenerateImage")}</span>
                      </>
                    )}
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
            )}

            {/* Loading overlay for generation */}
            {isGeneratingFull && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="bg-white rounded-xl p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#F28097] mx-auto mb-4" />
                  <p className="text-[#2D2D2D] font-semibold">Generating full book...</p>
                </div>
              </div>
            )}
          </div>

          {/* PDF Email Section - Only show after payment */}
          {isPaid && (
            <div className="bg-gradient-to-r from-[#F28097]/20 to-[#8880F2]/20 rounded-xl p-6 sm:p-8 mb-6">
              <p className="text-base sm:text-lg font-semibold text-[#2D2D2D] mb-4 text-center">
                {t("wantPdfCopy")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    placeholder={t("email")}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                  />
                </div>
                <button
                  className="relative px-4 sm:px-6 py-2.5 sm:py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
                >
                  <div className="inline-flex items-center justify-center gap-2 relative z-10">
                    <span className="text-white text-xs sm:text-base">{t("send")}</span>
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
          )}

          {/* Thumbnail Navigation with Custom Scrollbar */}
          <div className="relative p-4">
            {/* Left Arrow */}
            <button
              onClick={() => scrollThumbnails("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-2 shadow-md transition-all"
              aria-label="Scroll left"
            >
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-8 border-r-[#F28097] border-b-[6px] border-b-transparent"></div>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollThumbnails("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-2 shadow-md transition-all"
              aria-label="Scroll right"
            >
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-8 border-l-[#F28097] border-b-[6px] border-b-transparent"></div>
            </button>

            {/* Thumbnails Container */}
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar px-10"
            >
              {pages.slice(0, visiblePages).map((page, index) => (
                <div key={page.id} className="relative shrink-0 flex flex-col items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(index)}
                    className={`relative rounded-lg border-2 transition-all p-[6px] pb-[22px] bg-[#F2809780] ${currentPage === index
                        ? "border-[#F28097] opacity-100"
                        : "border-[#F28097]/50 opacity-50 hover:opacity-75"
                      }`}
                  >
                    <Image
                      src={page.image}
                      alt={page.label}
                      width={100}
                      height={100}
                      className="object-cover rounded min-h-[100px] min-w-[100px]"
                      unoptimized={isCreateOwnBook} // Unoptimized for external API images
                    />
                  </button>
                  <span className="absolute bottom-6 left-0 right-0 text-center text-xs text-text-primary font-comme">
                    {page.label}
                  </span>
                </div>
              ))}

              {/* Locked Pages Indicators - Show based on totalPage from API */}
              {!isPaid && isCreateOwnBook && Array.from({ length: totalPages - visiblePages }).map((_, idx) => (
                <div key={`locked-${idx}`} className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-20 h-28 sm:w-[100px] sm:h-32 rounded-lg border-2 border-dashed border-[#F28097]/40 flex items-center justify-center bg-pink-50/50 opacity-50">
                    <Lock className="w-5 h-5 text-[#F28097]/60" />
                  </div>
                  <span className="text-xs text-[#636F85] font-medium opacity-50">
                    {visiblePages + idx + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Custom Scrollbar with Arrows */}
            {/* <div className="relative mt-2">

              <button
                onClick={() => scrollThumbnails("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center"
                aria-label="Scroll left"
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-8 border-r-[#F28097] border-b-[6px] border-b-transparent"></div>
              </button>

              <div className="mx-8 h-2 bg-[#F28097]/30 rounded-full relative">
                <div
                  className="h-full bg-[#F28097] rounded-full transition-all duration-300"
                  style={{
                    width: `${(visiblePages / totalPages) * 100}%`,
                    maxWidth: "100%",
                  }}
                />
              </div>

              <button
                onClick={() => scrollThumbnails("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center"
                aria-label="Scroll right"
              >
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-8 border-l-[#F28097] border-b-[6px] border-b-transparent"></div>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">{t("completePayment")}</h2>
            <p className="text-[#636F85] mb-6">
              {t("payToUnlock", { totalPages })}
            </p>
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
              >
                <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                  <span className="text-white text-sm sm:text-lg">{t("payNow")}</span>
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
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-3 rounded-xl border-2 border-[#F28097] text-[#F28097] font-semibold bg-white hover:bg-pink-50 transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10 text-center">
            {/* Party Popper Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: gradientInitial }}>
                  <span className="text-4xl sm:text-5xl">🎉</span>
                </div>
                {/* Confetti effects */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-sm transform rotate-45"></div>
                <div className="absolute -top-4 left-4 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-blue-400 rounded-sm transform -rotate-45"></div>
                <div className="absolute top-8 -right-6 w-3 h-3 bg-pink-400 rounded-full"></div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D] mb-4">
              {t("paymentSuccessful")}
            </h2>
            <p className="text-[#636F85] mb-8 text-sm sm:text-base">
              {t("nowYouCanReview")}
            </p>

            <button
              onClick={handleContinue}
              className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
            >
              <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                <span className="text-white text-xs sm:text-base">{t("reviewAndCustomize")}</span>
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
      )}

      {/* Change Child Info Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2D2D] mb-6">{t("changeChildInfo")}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">{t("name")}</label>
                <input
                  type="text"
                  value={updatedChildName}
                  onChange={(e) => setUpdatedChildName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-[#2D2D2D] text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">{t("age")}</label>
                <select
                  value={updatedAge}
                  onChange={(e) => setUpdatedAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-[#2D2D2D] text-sm bg-white"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">{t("gender")}</label>
                <select
                  value={updatedGender}
                  onChange={(e) => setUpdatedGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-[#2D2D2D] text-sm bg-white"
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="Male">{t("male")}</option>
                  <option value="Female">{t("female")}</option>
                  <option value="Both">{t("both")}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-6 py-2.5 rounded-xl border-2 border-[#F28097] text-[#F28097] font-semibold text-sm bg-white hover:bg-pink-50 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSaveChildInfo}
                className="relative px-4 sm:px-6 py-2.5 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
              >
                <div className="inline-flex items-center justify-center gap-2 relative z-10">
                  <span className="text-white text-xs sm:text-sm">{t("save")}</span>
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
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-25px) translateX(15px);
          }
        }
        .custom-scrollbar {
          scrollbar-width: bold;
          scrollbar-color: #F28097 #F2809730;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(242, 128, 151, 0.2);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F28097;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e06d8a;
        }
      `}</style>
    </div>
  );
}