"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreateBookMutation } from "@/store/api/bookApi";
import { 
  getBookCreationData, 
  saveBookCreationData, 
  getAcceptedImageFiles,
  mapImageStyleToAPI,
  mapLanguageToAPI,
  clearBookCreationData,
} from "@/utils/bookCreationData";
import { toast } from "sonner";

export default function StoryIdeaPage() {
  const t = useTranslations("StoryIdea");
  const router = useRouter();
  const [storyIdea, setStoryIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [createBook] = useCreateBookMutation();

  const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

  // Load existing story idea if available
  useEffect(() => {
    const data = getBookCreationData();
    if (data.storyIdea) {
      setStoryIdea(data.storyIdea);
    }
  }, []);

  const handleBack = () => {
    // Save story idea before going back
    saveBookCreationData({ storyIdea });
    router.push("/create-own-book/language");
  };

  const handleNext = async () => {
    if (!storyIdea.trim()) {
      toast.error("Please enter your story idea");
      return;
    }

    setIsGenerating(true);
    saveBookCreationData({ storyIdea });

    try {
      const bookData = getBookCreationData();
      
      // Validate all required data
      if (!bookData.gender || !bookData.childName || !bookData.childAge || 
          !bookData.imageStyle || !bookData.language) {
        toast.error("Please complete all previous steps");
        setIsGenerating(false);
        return;
      }

      // Get accepted images (max 3)
      const imageFiles = await getAcceptedImageFiles();
      if (imageFiles.length === 0) {
        toast.error("Please upload at least one accepted photo. Go back to the photo upload page.");
        setIsGenerating(false);
        return;
      }

      // Map values to API format
      const apiImageStyle = mapImageStyleToAPI(bookData.imageStyle);
      const apiLanguage = mapLanguageToAPI(bookData.language);
      const age = parseInt(bookData.childAge) || 8;

      // Prepare bodyData
      const bodyData = {
        gender: bookData.gender === "Boy" ? "Male" : "Female",
        characterName: bookData.childName,
        characterAge: age,
        style: apiImageStyle,
        language: apiLanguage.charAt(0).toUpperCase() + apiLanguage.slice(1),
        user_input: storyIdea,
      };

      // Create FormData
      const formData = new FormData();
      formData.append("bodyData", JSON.stringify(bodyData));
      
      // Append images (max 3)
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      toast.loading("Creating book...", { id: "create-book" });

      // Call create book API
      const result = await createBook(formData).unwrap();

      if (result.success && result.data) {
        // Save all API response data
        saveBookCreationData({
          previewImages: {
            "page 0": result.data.coverImageUrl || "",
            "page 1": result.data.firstPage?.fullPageUrl || result.data.coverImageUrl || "", // Use firstPage.fullPageUrl if available
          },
          bookId: result.data.id,
          bookTitle: result.data.title,
          apiCharacterName: result.data.characterName,
          apiCharacterAge: result.data.characterAge,
          totalPage: result.data.totalPage, // May be undefined initially
          firstPageFullUrl: result.data.firstPage?.fullPageUrl,
        });

        toast.success(result.message || "Book created successfully!", { id: "create-book" });
        
        // Don't clear data here - it's needed for preview page
        // Data will be cleared after payment success or when user exits the flow
        
        // Navigate to preview page
        router.push("/create-own-book/preview");
      } else {
        throw new Error(result.message || "Failed to create book");
      }
    } catch (error: unknown) {
      console.error("Error creating book:", error);
      const errorData = error as { data?: { message?: string; error?: { message?: string } }; message?: string };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.error?.message || 
        errorData?.message || 
        "Failed to create book. Please try again.";
      toast.error(errorMessage, { id: "create-book" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[100px] sm:my-[200px]">
      {/* Background with gradient and particles */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Main Content Card */}
        <div className="bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#F28097] shadow-2xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-6 sm:mb-8">
            {t("shareStoryIdea")}
          </h1>

          {/* Input Field */}
          <div className="mb-8 sm:mb-10">
            <label className="block text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4 font-jost">
              {t("writeStoryIdea")}
            </label>
            <textarea
              value={storyIdea}
              onChange={(e) => setStoryIdea(e.target.value)}
              placeholder={t("placeholder")}
              rows={5}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-base sm:text-lg bg-white text-[#2D2D2D] font-comme resize-none placeholder:text-[#9CA3AF]"
            />
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
            <span>{t("backToPreviousQuestion")}</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={isGenerating}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 font-dynapuff disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2 relative z-10 pointer-events-none">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>{t("goToNextQuestion")}</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
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

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-25px) translateX(15px);
          }
        }
      `}</style>
    </div>
  );
}

