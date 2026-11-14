"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { booksData } from "./bookData";
import { useTranslations } from "next-intl";

// ArrowDownSvg, reusable arrow icon component
const ArrowDownSvg = ({
  className = "",
  rotated = false,
}: {
  className?: string;
  rotated?: boolean;
}) => (
  <svg
    className={`${className} transition-transform duration-200 ${
      rotated ? "rotate-180" : ""
    }`}
    width="24"
    height="12"
    viewBox="0 0 24 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_28028_5935)">
      <path
        d="M17.42 2.45199L18.48 3.51299L12.703 9.29199C12.6104 9.38514 12.5004 9.45907 12.3791 9.50952C12.2579 9.55997 12.1278 9.58594 11.9965 9.58594C11.8652 9.58594 11.7352 9.55997 11.6139 9.50952C11.4927 9.45907 11.3826 9.38514 11.29 9.29199L5.51001 3.51299L6.57001 2.45299L11.995 7.87699L17.42 2.45199Z"
        fill="#636F85"
      />
    </g>
    <defs>
      <clipPath id="clip0_28028_5935">
        <rect
          width="12"
          height="24"
          fill="white"
          transform="matrix(0 1 -1 0 24 0)"
        />
      </clipPath>
    </defs>
  </svg>
);

// Custom hook for closing dropdowns on outside click
function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler]);
}

export default function BookCard() {
  const t = useTranslations("BookCard");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Refs for dropdowns
  const genderRef = useRef<HTMLDivElement>(null);
  const ageRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks for dropdowns
  useOutsideClick(genderRef, () => {
    if (showGenderDropdown) setShowGenderDropdown(false);
  });

  useOutsideClick(ageRef, () => {
    if (showAgeDropdown) setShowAgeDropdown(false);
  });

  useOutsideClick(languageRef, () => {
    if (showLanguageDropdown) setShowLanguageDropdown(false);
  });

  // Filter options
  const genderOptions = [
    { key: "boy", value: "Boy" },
    { key: "girl", value: "Girl" },
    { key: "both", value: "Both" }
  ];
  const ageOptions = ["2-4", "5-6", "7-8", "9-10", "All"];
  const languageOptions = [
    { key: "english", value: "English" },
    { key: "french", value: "French" },
    { key: "spanish", value: "Spanish" },
    { key: "italian", value: "Italian" },
    { key: "arabic", value: "Arabic" },
  ];

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    return booksData.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender =
        !selectedGender ||
        book.gender === selectedGender ||
        book.gender === "Both" ||
        selectedGender === "Both";

      const matchesAge = !selectedAge || book.childAge === selectedAge || selectedAge === "All";

      const matchesLanguage =
        !selectedLanguage || book.language === selectedLanguage;

      return matchesSearch && matchesGender && matchesAge && matchesLanguage;
    });
  }, [searchQuery, selectedGender, selectedAge, selectedLanguage]);

  const handlePersonalise = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";
  return (
    <div className="relative min-h-screen w-full  px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section with Search and Filters */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-md font-comme">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_28028_5913)">
                  <path
                    d="M6.62665 5.46195C6.28052 5.11555 5.71896 5.11555 5.37284 5.46195C4.08771 6.74708 3.45607 8.53733 3.63963 10.374C3.68543 10.8315 4.07088 11.1726 4.52102 11.1726C4.5506 11.1726 4.58041 11.1711 4.60999 11.1681C5.0974 11.1194 5.45295 10.6846 5.4042 10.1975C5.27356 8.89227 5.71929 7.62313 6.62665 6.71572C6.97306 6.36964 6.97306 5.80803 6.62665 5.46195Z"
                    fill="#F28097"
                  />
                  <path
                    d="M10.1379 0C4.54786 0 0 4.54786 0 10.1379C0 15.728 4.54786 20.2759 10.1379 20.2759C15.728 20.2759 20.2759 15.728 20.2759 10.1379C20.2759 4.54786 15.728 0 10.1379 0ZM10.1379 18.5025C5.52562 18.5025 1.77342 14.7502 1.77342 10.1379C1.77342 5.52562 5.52562 1.77342 10.1379 1.77342C14.75 1.77342 18.5025 5.52562 18.5025 10.1379C18.5025 14.7502 14.7502 18.5025 10.1379 18.5025Z"
                    fill="#F28097"
                  />
                  <path
                    d="M23.7402 22.4863L17.2968 16.043C16.9504 15.6966 16.3894 15.6966 16.043 16.043C15.6966 16.3891 15.6966 16.9507 16.043 17.2968L22.4864 23.7402C22.5686 23.8226 22.6663 23.8881 22.7739 23.9326C22.8815 23.9772 22.9968 24.0001 23.1133 23.9999C23.3403 23.9999 23.567 23.9134 23.7402 23.7402C24.0866 23.394 24.0866 22.8325 23.7402 22.4863Z"
                    fill="#F28097"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_28028_5913">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <input
                type="text"
                placeholder={t("searchBooks")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-white text-gray-800 placeholder-[#F28097] focus:outline-none focus:ring-2 focus:ring-[#8880F2] shadow-md"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Gender Filter */}
              <div className="relative font-comme" ref={genderRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGenderDropdown(!showGenderDropdown);
                        setShowAgeDropdown(false);
                        setShowLanguageDropdown(false);
                      }}
                      className="flex items-center gap-2 bg-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-md hover:shadow-lg transition-shadow text-gray-700 font-medium text-sm sm:text-base"
                    >
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.83422 12.2611L6.61897 9.47637C7.68422 10.2742 9.01218 10.6389 10.3355 10.497C11.6588 10.3551 12.8793 9.71714 13.7512 8.71156C14.623 7.70598 15.0816 6.40745 15.0345 5.07736C14.9875 3.74727 14.4383 2.4844 13.4975 1.54296C12.5567 0.601528 11.2942 0.0514377 9.96418 0.00342861C8.63412 -0.0445804 7.33526 0.413057 6.32907 1.28422C5.32287 2.15537 4.68405 3.37537 4.54121 4.6986C4.39837 6.02183 4.76211 7.35005 5.55922 8.41587L2.77372 11.2014L1.71322 10.1401C1.57249 9.99949 1.38165 9.92052 1.1827 9.92059C0.983748 9.92066 0.792972 9.99976 0.652341 10.1405C0.51171 10.2812 0.432744 10.4721 0.432814 10.671C0.432885 10.87 0.511986 11.0607 0.652716 11.2014L1.71322 12.2626L0.228966 13.7461C0.157333 13.8153 0.100197 13.8981 0.0608901 13.9896C0.0215833 14.0811 0.00089368 14.1795 2.83175e-05 14.2791C-0.000837045 14.3787 0.0181393 14.4774 0.0558499 14.5696C0.0935606 14.6618 0.14925 14.7455 0.21967 14.8159C0.290089 14.8863 0.373828 14.942 0.466001 14.9797C0.558173 15.0174 0.656933 15.0364 0.756517 15.0356C0.856102 15.0347 0.954517 15.014 1.04602 14.9747C1.13752 14.9354 1.22028 14.8783 1.28947 14.8066L2.77372 13.3224L3.83422 14.3829C3.9034 14.4545 3.98616 14.5116 4.07766 14.5509C4.16917 14.5903 4.26758 14.6109 4.36717 14.6118C4.46675 14.6127 4.56551 14.5937 4.65768 14.556C4.74985 14.5183 4.83359 14.4626 4.90401 14.3922C4.97443 14.3217 5.03012 14.238 5.06783 14.1458C5.10554 14.0537 5.12452 13.9549 5.12365 13.8553C5.12279 13.7557 5.1021 13.6573 5.06279 13.5658C5.02349 13.4743 4.96635 13.3916 4.89472 13.3224L3.83422 12.2611ZM9.75922 1.52637C10.5009 1.52637 11.2259 1.7463 11.8426 2.15836C12.4593 2.57041 12.9399 3.15608 13.2238 3.8413C13.5076 4.52653 13.5819 5.28053 13.4372 6.00796C13.2925 6.73538 12.9353 7.40357 12.4109 7.92802C11.8864 8.45246 11.2182 8.80962 10.4908 8.95431C9.76338 9.09901 9.00938 9.02474 8.32415 8.74092C7.63893 8.45709 7.05326 7.97644 6.64121 7.35976C6.22915 6.74307 6.00922 6.01805 6.00922 5.27637C6.00922 4.28181 6.4043 3.32798 7.10757 2.62472C7.81083 1.92146 8.76465 1.52637 9.75922 1.52637Z"
                          fill="#636F85"
                        />
                        <path
                          d="M21.7593 7.52637H18.0093C17.8104 7.52637 17.6197 7.60538 17.479 7.74604C17.3383 7.88669 17.2593 8.07745 17.2593 8.27637C17.2593 8.47528 17.3383 8.66604 17.479 8.8067C17.6197 8.94735 17.8104 9.02637 18.0093 9.02637H19.9488L15.8988 13.0764C14.8333 12.279 13.5052 11.9148 12.1819 12.0572C10.8587 12.1997 9.63851 12.8381 8.76704 13.844C7.89556 14.8499 7.4375 16.1485 7.48505 17.4786C7.53261 18.8086 8.08225 20.0713 9.02334 21.0124C9.96442 21.9534 11.2271 22.5031 12.5571 22.5506C13.8872 22.5982 15.1858 22.1401 16.1917 21.2687C17.1976 20.3972 17.836 19.177 17.9785 17.8538C18.1209 16.5305 17.7567 15.2024 16.9593 14.1369L21.0093 10.0869V12.0264C21.0093 12.2253 21.0883 12.416 21.229 12.5567C21.3697 12.6974 21.5604 12.7764 21.7593 12.7764C21.9582 12.7764 22.149 12.6974 22.2897 12.5567C22.4303 12.416 22.5093 12.2253 22.5093 12.0264V8.27637C22.5093 8.07745 22.4303 7.88669 22.2897 7.74604C22.149 7.60538 21.9582 7.52637 21.7593 7.52637ZM12.7593 21.0264C12.0177 21.0264 11.2926 20.8064 10.6759 20.3944C10.0593 19.9823 9.57861 19.3967 9.29478 18.7114C9.01096 18.0262 8.93669 17.2722 9.08139 16.5448C9.22608 15.8173 9.58324 15.1492 10.1077 14.6247C10.6321 14.1003 11.3003 13.7431 12.0277 13.5984C12.7552 13.4537 13.5092 13.528 14.1944 13.8118C14.8796 14.0956 15.4653 14.5763 15.8773 15.193C16.2894 15.8097 16.5093 16.5347 16.5093 17.2764C16.5093 17.7688 16.4123 18.2565 16.2239 18.7114C16.0354 19.1664 15.7592 19.5798 15.411 19.928C15.0628 20.2762 14.6494 20.5525 14.1944 20.7409C13.7394 20.9294 13.2518 21.0264 12.7593 21.0264Z"
                          fill="#636F85"
                        />
                      </svg>

                      <span>{t("gender")}</span>
                      <ArrowDownSvg className="" rotated={showGenderDropdown} />
                    </button>
                    {showGenderDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg z-50 min-w-[150px]">
                        {genderOptions.map((option) => (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => {
                              setSelectedGender(
                                selectedGender === option.value ? null : option.value
                              );
                              setShowGenderDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                              selectedGender === option.value
                                ? "bg-[#8880F2]/10 text-[#8880F2]"
                                : ""
                            }`}
                          >
                            {t(option.key)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

              {/* Child Age Filter */}
              <div className="relative font-comme" ref={ageRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAgeDropdown(!showAgeDropdown);
                        setShowGenderDropdown(false);
                        setShowLanguageDropdown(false);
                      }}
                      className="flex items-center gap-2 bg-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-md hover:shadow-lg transition-shadow text-gray-700 font-medium text-sm sm:text-base"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_28028_5930)">
                          <path
                            d="M22.1176 23.1441L21.3076 17.4736C20.9917 15.2616 19.5432 13.4081 17.5534 12.5358C18.7623 11.2036 19.5001 9.43641 19.5001 7.5C19.5001 3.36469 16.1354 0 12.0001 0C7.86481 0 4.50012 3.36469 4.50012 7.5C4.50012 9.43641 5.23793 11.2036 6.44684 12.5358C4.45746 13.4081 3.00856 15.2616 2.69262 17.4736L1.88262 23.1441C1.85168 23.3592 1.9159 23.5772 2.0584 23.7417C2.2009 23.9058 2.40762 24.0005 2.62512 24.0005H21.3751C21.5926 24.0005 21.7993 23.9062 21.9418 23.7417C22.0843 23.5777 22.1486 23.3597 22.1176 23.1441ZM9.43277 2.0775C9.39448 2.25748 9.37515 2.44099 9.37512 2.625C9.37512 4.0725 10.5526 5.25 12.0001 5.25C12.4145 5.25 12.7501 4.91437 12.7501 4.5C12.7501 4.08563 12.4145 3.75 12.0001 3.75C11.38 3.75 10.8751 3.24516 10.8751 2.625C10.8751 2.00484 11.38 1.5 12.0001 1.5C15.3086 1.5 18.0001 4.19156 18.0001 7.5C18.0001 10.8084 15.3086 13.5 12.0001 13.5C8.69168 13.5 6.00012 10.8084 6.00012 7.5C6.00012 5.10984 7.40543 3.04172 9.43277 2.0775ZM13.7828 14.7853C13.5353 15.9825 12.819 16.875 12.0001 16.875C11.1812 16.875 10.465 15.9825 10.2175 14.7853C10.7889 14.925 11.3861 15 12.0001 15C12.6142 15 13.2114 14.9255 13.7828 14.7853ZM3.48996 22.5L4.17762 17.6855C4.45465 15.7477 5.86746 14.1694 7.73731 13.6673C8.02366 13.8659 8.32344 14.0443 8.63449 14.2013C8.68934 15.2339 9.00152 16.2028 9.52934 16.957C10.1603 17.8584 11.0607 18.3755 12.0001 18.3755C12.9395 18.3755 13.84 17.8584 14.4709 16.957C14.9987 16.2028 15.3114 15.2344 15.3657 14.2013C15.6768 14.0443 15.9766 13.8659 16.2629 13.6673C18.1328 14.1694 19.5461 15.7477 19.8226 17.6855L20.5103 22.5H3.48996Z"
                            fill="#636F85"
                          />
                          <path
                            d="M12 11.625C13.2408 11.625 14.25 10.6158 14.25 9.375C14.25 8.96062 13.9144 8.625 13.5 8.625C13.0856 8.625 12.75 8.96062 12.75 9.375C12.75 9.78938 12.4134 10.125 12 10.125C11.5866 10.125 11.25 9.78844 11.25 9.375C11.25 8.96156 10.9144 8.625 10.5 8.625C10.0856 8.625 9.75 8.96062 9.75 9.375C9.75 10.6158 10.7592 11.625 12 11.625Z"
                            fill="#636F85"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_28028_5930">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span>{t("childAge")}</span>
                      <ArrowDownSvg className="ml-2" rotated={showAgeDropdown} />
                    </button>
                    {showAgeDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg z-50 min-w-[150px]">
                        {ageOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSelectedAge(
                                selectedAge === option ? null : option
                              );
                              setShowAgeDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                              selectedAge === option
                                ? "bg-[#8880F2]/10 text-[#8880F2]"
                                : ""
                            }`}
                          >
                            {option === "All" ? t("all") : option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

              {/* Language Filter */}
              <div className="relative font-comme" ref={languageRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLanguageDropdown(!showLanguageDropdown);
                        setShowGenderDropdown(false);
                        setShowAgeDropdown(false);
                      }}
                      className="flex items-center gap-2 bg-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-md hover:shadow-lg transition-shadow text-gray-700 font-medium text-sm sm:text-base"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_28028_5930)">
                          <path
                            d="M22.1176 23.1441L21.3076 17.4736C20.9917 15.2616 19.5432 13.4081 17.5534 12.5358C18.7623 11.2036 19.5001 9.43641 19.5001 7.5C19.5001 3.36469 16.1354 0 12.0001 0C7.86481 0 4.50012 3.36469 4.50012 7.5C4.50012 9.43641 5.23793 11.2036 6.44684 12.5358C4.45746 13.4081 3.00856 15.2616 2.69262 17.4736L1.88262 23.1441C1.85168 23.3592 1.9159 23.5772 2.0584 23.7417C2.2009 23.9058 2.40762 24.0005 2.62512 24.0005H21.3751C21.5926 24.0005 21.7993 23.9062 21.9418 23.7417C22.0843 23.5777 22.1486 23.3597 22.1176 23.1441ZM9.43277 2.0775C9.39448 2.25748 9.37515 2.44099 9.37512 2.625C9.37512 4.0725 10.5526 5.25 12.0001 5.25C12.4145 5.25 12.7501 4.91437 12.7501 4.5C12.7501 4.08563 12.4145 3.75 12.0001 3.75C11.38 3.75 10.8751 3.24516 10.8751 2.625C10.8751 2.00484 11.38 1.5 12.0001 1.5C15.3086 1.5 18.0001 4.19156 18.0001 7.5C18.0001 10.8084 15.3086 13.5 12.0001 13.5C8.69168 13.5 6.00012 10.8084 6.00012 7.5C6.00012 5.10984 7.40543 3.04172 9.43277 2.0775ZM13.7828 14.7853C13.5353 15.9825 12.819 16.875 12.0001 16.875C11.1812 16.875 10.465 15.9825 10.2175 14.7853C10.7889 14.925 11.3861 15 12.0001 15C12.6142 15 13.2114 14.9255 13.7828 14.7853ZM3.48996 22.5L4.17762 17.6855C4.45465 15.7477 5.86746 14.1694 7.73731 13.6673C8.02366 13.8659 8.32344 14.0443 8.63449 14.2013C8.68934 15.2339 9.00152 16.2028 9.52934 16.957C10.1603 17.8584 11.0607 18.3755 12.0001 18.3755C12.9395 18.3755 13.84 17.8584 14.4709 16.957C14.9987 16.2028 15.3114 15.2344 15.3657 14.2013C15.6768 14.0443 15.9766 13.8659 16.2629 13.6673C18.1328 14.1694 19.5461 15.7477 19.8226 17.6855L20.5103 22.5H3.48996Z"
                            fill="#636F85"
                          />
                          <path
                            d="M12 11.625C13.2408 11.625 14.25 10.6158 14.25 9.375C14.25 8.96062 13.9144 8.625 13.5 8.625C13.0856 8.625 12.75 8.96062 12.75 9.375C12.75 9.78938 12.4134 10.125 12 10.125C11.5866 10.125 11.25 9.78844 11.25 9.375C11.25 8.96156 10.9144 8.625 10.5 8.625C10.0856 8.625 9.75 8.96062 9.75 9.375C9.75 10.6158 10.7592 11.625 12 11.625Z"
                            fill="#636F85"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_28028_5930">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span>{t("language")}</span>
                      <ArrowDownSvg
                        className="ml-2"
                        rotated={showLanguageDropdown}
                      />
                    </button>
                    {showLanguageDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg z-50 min-w-[150px]">
                        {languageOptions.map((option) => (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => {
                              setSelectedLanguage(
                                selectedLanguage === option.value ? null : option.value
                              );
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                              selectedLanguage === option.value
                                ? "bg-[#8880F2]/10 text-[#8880F2]"
                                : ""
                            }`}
                          >
                            {t(option.key)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl w-full p-5 sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Book Cover with Discount Badge */}
              <div className="relative w-full bg-gray-100  mb-[10px] max-h-[371px] h-[371px]">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover max-h-[371px] rounded-2xl"
                  //   sizes="(max-width: 371px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Discount Badge */}
                <div className="absolute top-[-20px] right-[-20px]">
                  <span className="text-white font-bold font-comme text-sm sm:text-base absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    -{book.discount}%
                  </span>
                  <svg
                    width="68"
                    height="67"
                    viewBox="0 0 68 67"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31.2185 0.774349C32.6264 -0.257971 34.5411 -0.25797 35.949 0.77435L42.6989 5.72365C43.3129 6.1739 44.0428 6.43953 44.8026 6.48932L53.1546 7.03668C54.8967 7.15085 56.3635 8.38163 56.7784 10.0774L58.7678 18.2075C58.9487 18.9471 59.3371 19.6197 59.8871 20.1463L65.9333 25.9342C67.1944 27.1414 67.5269 29.0271 66.7548 30.5928L63.0528 38.0996C62.716 38.7825 62.5811 39.5474 62.664 40.3043L63.5753 48.6245C63.7654 50.3599 62.808 52.0182 61.21 52.7213L53.5489 56.0922C52.8519 56.3988 52.257 56.8981 51.834 57.5312L47.1839 64.4906C46.214 65.9422 44.4147 66.5971 42.7387 66.1085L34.7031 63.7663C33.9721 63.5532 33.1954 63.5532 32.4644 63.7663L24.4288 66.1085C22.7528 66.5971 20.9535 65.9422 19.9836 64.4906L15.3335 57.5312C14.9105 56.8981 14.3156 56.3988 13.6186 56.0922L5.95744 52.7213C4.35948 52.0182 3.4021 50.3599 3.59218 48.6245L4.50345 40.3043C4.58636 39.5474 4.45149 38.7825 4.11471 38.0996L0.412707 30.5928C-0.359454 29.0271 -0.0269586 27.1414 1.23415 25.9342L7.28036 20.1463C7.83041 19.6197 8.21873 18.9471 8.39971 18.2075L10.3891 10.0774C10.804 8.38163 12.2708 7.15085 14.0129 7.03668L22.3649 6.48932C23.1247 6.43953 23.8545 6.1739 24.4686 5.72365L31.2185 0.774349Z"
                      fill="#52C41A"
                    />
                  </svg>
                </div>
              </div>

              {/* Book Info */}
              <div className="">
                <h3 className="font-bold text-base sm:text-lg md:text-xl mb-[10px] text-text-primary font-jost line-clamp-2">
                  {book.title}
                </h3>
                <p className=" text-sm sm:text-base mb-[10px] line-clamp-1 font-comme text-text-sec">
                  {book.subtitle}
                </p>
                <p className="text-xs sm:text-base mb-5 sm:mb-6 font-semibold font-comme text-text-primary">
                  {book.age}
                </p>

                {/* Personalise Button */}
                <button
                  onClick={() => handlePersonalise(book.id)}
                  className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden border border-white font-dynapuff"
                  style={{ height: "48px" }}
                >
                  <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                    <span className="text-white">{t("personalize")}</span>
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
          ))}
        </div>

        {/* View All Books Button */}
        <div className="flex justify-center">
          <button
            className="relative cursor-pointer inline-flex items-center justify-center gap-2 z-10 translate-y-[3px] px-4 sm:px-5 md:px-6 py-2 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 overflow-hidden border border-white shadow-lg hover:shadow-xl active:scale-[0.98] group w-fit mt-4 sm:mt-0"
            aria-label="View all bestsellers"
          >
            <span className="relative z-10 text-white font-dynapuff">
              {t("viewAllBooks")}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path
                d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                fill="white"
              />
            </svg>
            {/* Initial gradient background */}
            <span
              className="absolute inset-0 rounded-lg transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            {/* Hover gradient overlay */}
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
