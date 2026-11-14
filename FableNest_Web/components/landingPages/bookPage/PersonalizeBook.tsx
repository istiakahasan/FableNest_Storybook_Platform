"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Upload, X } from "lucide-react";
import { BookData } from "./bookData";
import { useTranslations } from "next-intl";

interface PersonalizeBookProps {
  book: BookData;
}

export default function PersonalizeBook({ book }: PersonalizeBookProps) {
  const t = useTranslations("PersonalizeBook");
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("6");
  const [language, setLanguage] = useState("english");
  const [gender, setGender] = useState("");
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; status: "rejected" | "accepted" }>>([]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const ageDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  const ageOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const languageOptions = [
    { key: "english", value: "English" },
    { key: "french", value: "French" },
    { key: "spanish", value: "Spanish" },
    { key: "italian", value: "Italian" },
    { key: "arabic", value: "Arabic" }
  ];
  const genderOptions = [
    { key: "boy", value: "Boy" },
    { key: "girl", value: "Girl" },
    { key: "both", value: "Both" }
  ];

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ageDropdownRef.current && !ageDropdownRef.current.contains(event.target as Node)) {
        setShowAgeDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setShowGenderDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          // Simulate validation - randomly accept or reject
          const status = Math.random() > 0.3 ? "accepted" : "rejected";
          setUploadedImages((prev) => [...prev, { url, status }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  const handlePersonalizePreview = () => {
    // Navigate to preview page with form data
    const params = new URLSearchParams({
      childName,
      age,
      language,
      gender,
    });
    router.push(`/books/${book.id}/preview?${params.toString()}`);
  };

  return (
    <div className="relative max-w-[1280px] mx-auto w-[95%]  lg:my-[210px] md:my-[150px] sm:my-[100px] my-20">
      {/* Background with gradient and particles */}
      <div
        className="absolute inset-0"
      >
      </div>

      <div className="relative z-10 mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-jost text-text-primary mb-1 leading-tight flex items-center gap-2">
            {t("personalizeBook")} <Image src="/collection/personalize_book.png" alt="book" width={27} height={27} />
          </h1>
          <p className="text-sm sm:text-base text-text-sec font-comme mt-2">{book.title}</p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Section - Input Fields */}
          <div className="space-y-4 sm:space-y-5">
            {/* Child's Name */}
            <div>
               <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                 {t("childsName")}
               </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-[#2D2D2D] text-sm bg-white"
                placeholder={t("namePlaceholder")}
              />
            </div>

            {/* Age */}
            <div className="relative" ref={ageDropdownRef}>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                {t("age")}
              </label>
              <button
                onClick={() => {
                  setShowAgeDropdown(!showAgeDropdown);
                  setShowLanguageDropdown(false);
                  setShowGenderDropdown(false);
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-[#2D2D2D] text-sm flex items-center justify-between bg-white"
              >
                <span>{age}</span>
                <ChevronDown className="w-4 h-4 text-[#636F85]" />
              </button>
              {showAgeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200">
                  {ageOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setAge(option);
                        setShowAgeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-sm text-[#2D2D2D]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language */}
            <div className="relative" ref={languageDropdownRef}>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                {t("language")}
              </label>
              <button
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowAgeDropdown(false);
                  setShowGenderDropdown(false);
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-[#2D2D2D] text-sm flex items-center justify-between bg-white"
              >
                <span>{t(language)}</span>
                <ChevronDown className="w-4 h-4 text-[#636F85]" />
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
                  {languageOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setLanguage(option.key);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-sm text-[#2D2D2D]"
                    >
                      {t(option.key)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="relative" ref={genderDropdownRef}>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                {t("gender")}
              </label>
              <button
                onClick={() => {
                  setShowGenderDropdown(!showGenderDropdown);
                  setShowAgeDropdown(false);
                  setShowLanguageDropdown(false);
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm flex items-center justify-between bg-white"
              >
                <span className={gender ? "text-[#2D2D2D]" : "text-[#9E9E9E]"}>
                  {gender ? t(gender) : t("selectGender")}
                </span>
                <ChevronDown className="w-4 h-4 text-[#636F85]" />
              </button>
              {showGenderDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
                  {genderOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setGender(option.key);
                        setShowGenderDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-sm text-[#2D2D2D]"
                    >
                      {t(option.key)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Photo Upload */}
          <div className="">
             <h2 className="text-sm font-semibold text-[#2D2D2D] mb-2">
               {t("uploadChildPhoto")}
             </h2>

            {/* Upload Area with dashed border */}
            <div className="border-2 border-dashed border-[#F28097] rounded-2xl p-6 sm:p-8 bg-white/30 min-h-[320px] flex flex-col items-center justify-center">
              {uploadedImages.length === 0 ? (
                /* Empty State */
                <div className="text-center space-y-3 w-full mb-3">
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  </div>
                  
                  <p className="text-sm text-text-primary font-comme">
                    {t("uploadPhoto")}
                  </p>
                  
                  <div className="inline-block font-dynapuff">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      multiple
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
                    >
                      <div className="inline-flex items-center justify-center gap-2 relative z-10">
                        <Upload className="w-4 h-4 text-white" />
                        <span className="text-white text-lg">{t("uploadImage")}</span>
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
                  
                  <p className="text-xs text-text-sec font-comme">
                    {t("pngJpgUpTo10MB")}
                  </p>
                </div>
              ) : uploadedImages.length === 1 ? (
                /* Single Image View */
                <div className="text-center space-y-4 w-full">
                  <div className="relative w-48 h-48 mx-auto">
                    <div
                      className={`relative w-full h-full rounded-full overflow-hidden border-4 ${
                        uploadedImages[0].status === "accepted" ? "border-green-500" : "border-red-500"
                      }`}
                    >
                      <Image
                        src={uploadedImages[0].url}
                        alt="Uploaded child photo"
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                      <button
                        onClick={() => removeImage(0)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-10"
                        aria-label="Remove image"
                      >
                         <X className="w-5 h-5 text-white stroke-3" />
                      </button>
                    </div>
                  </div>
                  
                  {uploadedImages[0].status === "accepted" && (
                    <p className="text-sm text-green-600 font-medium">
                      {t("imageLooksPerfect")}
                    </p>
                  )}
                </div>
              ) : (
                /* Multiple Images Grid (2 rows x 3 cols) */
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-3 gap-3 justify-items-center">
                    {uploadedImages.slice(0, 6).map((img, index) => (
                      <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <div
                          className={`relative w-full h-full`}
                        >
                          <Image
                            src={img.url}
                            alt={`Upload ${index + 1}`}
                            fill
                            className={`object-cover rounded-full border-4 ${
                              img.status === "accepted" ? "border-green-500" : "border-red-500"
                            }`}
                            sizes="96px"
                          />
                          <button
                            onClick={() => removeImage(index)}
                             className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-50"
                            aria-label={`Remove image ${index + 1}`}
                          >
                             <X className="w-4 h-4 text-white stroke-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center space-y-3">
                    <p className="text-sm text-[#2D2D2D] font-medium">
                      {t("uploadPhoto")}
                    </p>
                    
                    <div className="inline-block">
                      <input
                        ref={fileInputRef2}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef2.current?.click()}
                        className="relative px-6 py-3 font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
                      >
                        <div className="inline-flex items-center justify-center gap-2 relative z-10">
                          <Upload className="w-4 h-4 text-white" />
                          <span className="text-white text-lg">{t("uploadImage")}</span>
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
                    
                    <p className="text-xs text-[#9E9E9E]">
                      {t("pngJpgUpTo10MB")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

         {/* Bottom Action Button */}
         <div className="mt-6 sm:mt-8">
           <button
             onClick={handlePersonalizePreview}
             className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
           >
             <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
               <span className="text-white text-lg">{t("personalizePreview")}</span>
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