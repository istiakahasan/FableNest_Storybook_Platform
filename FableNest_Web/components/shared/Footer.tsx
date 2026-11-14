"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdKeyboardArrowDown, MdLanguage } from "react-icons/md";

const Footer = () => {
  const t = useTranslations("Footer");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale
  const currentLocale = locale || "en";

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "it", label: "Italian" },
    { code: "sp", label: "Spanish" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (code: string) => {
    router.replace(pathname, { locale: code });
    setIsLanguageDropdownOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <footer className="bg-transparent py-6 sm:py-8 font-sans text-gray-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* top section logo and button */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          {/* Logo */}
          <div className="w-24 sm:w-28 md:w-32 h-auto relative">
            <Image
              src="/logos/blackLogo.png"
              alt="Face2toon Logo"
              width={100}
              height={100}
              className="object-contain w-full h-auto"
              priority
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
            />
          </div>

          {/* Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center space-x-1 border border-gray-300 rounded px-3 py-1.5 text-xs sm:text-sm hover:border-gray-400 transition-colors"
            >
              <MdLanguage className="text-gray-500 text-base sm:text-lg" />
              <span className="font-medium text-gray-700">{currentLanguage.label}</span>
              <MdKeyboardArrowDown
                className={`text-gray-500 text-base sm:text-lg transition-transform duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50 overflow-hidden border border-gray-300">
                {languages.map((language, index) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors ${
                      index !== languages.length - 1 ? "border-b border-gray-300" : ""
                    } ${
                      currentLocale === language.code
                        ? "bg-gray-50 font-semibold text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {/* <MdLanguage className="text-gray-500 text-base sm:text-lg" /> */}
                    <span className="font-medium">{language.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-y-10">
          {/* Column 1: Brand Info (Span 4 cols on desktop) */}
          <div className="md:col-span-4 flex flex-col space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base leading-relaxed pr-0 md:pr-4">
              {t("description")}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 sm:space-x-5 pt-2">
              <Link
                href="#"
                className="text-[#443BC9] hover:opacity-80 transition-opacity text-lg sm:text-xl">
                <FaFacebookF />
              </Link>
              <Link
                href="#"
                className="text-[#443BC9] hover:opacity-80 transition-opacity text-lg sm:text-xl">
                <FaInstagram />
              </Link>
              <Link
                href="#"
                className="text-[#443BC9] hover:opacity-80 transition-opacity text-lg sm:text-xl">
                <FaTwitter />
              </Link>
            </div>
          </div>

          {/* Column 2: About (Span 2 cols on desktop) */}
          <div className="md:col-span-2 md:ml-auto">
            <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-4 sm:mb-6">
              {t("aboutFace2toon")}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 transition-colors text-sm sm:text-base">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="hover:text-gray-900 transition-colors text-sm sm:text-base">
                  {t("books")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Area (Span 2 cols on desktop) */}
          <div className="md:col-span-2">
            <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-4 sm:mb-6">
              {t("customerArea")}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-gray-900 transition-colors text-sm sm:text-base">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-900 transition-colors text-sm sm:text-base">
                  {t("termsConditions")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Payments (Span 4 cols on desktop) */}
          <div className="md:col-span-4">
            <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-4">
              {t("subscribeNewsletter")}
            </h3>
            <p className="mb-4 text-sm sm:text-base">
              {t("dontMissNewestBooks")}
            </p>

            {/* Subscribe Form - Responsive */}
            <form className="flex flex-col sm:flex-row w-full flex-wrap max-w-md mb-6 sm:mb-8 gap-2 sm:gap-0">
              <input
                type="email"
                placeholder={t("enterEmail")}
                className="grow border border-gray-300 rounded sm:rounded-l px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-400 sm:rounded-r-none"
              />
              <button
                type="submit"
                className="bg-linear-to-r from-[#8a63b3] to-[#d98fa8] text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded sm:rounded-r hover:opacity-90 transition-opacity text-sm sm:text-base rounded-t-none sm:rounded-tl-none sm:rounded-tr">
                {t("subscribe")}
              </button>
            </form>

            {/* Payment Icons - Responsive */}
            <div>
              <p className="text-gray-700 mb-3 text-xs sm:text-sm md:text-base">
                {t("weAccept")}
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 sm:h-9 md:h-10 w-12 sm:w-14 md:w-16 relative border rounded bg-gray-50 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">AMEX</span>
                </div>
                <div
                  className="h-8 sm:h-9 md:h-10 w-12 sm:w-14 md:w-16 relative border rounded bg-gray-50 flex items-center justify-center"
                  style={{ backgroundColor: "#ffb3c7" }}>
                  <span className="text-xs font-bold text-black">Klarna.</span>
                </div>
                <div className="h-8 sm:h-9 md:h-10 w-12 sm:w-14 md:w-16 relative border rounded bg-gray-50 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800 italic">
                    PayPal
                  </span>
                </div>
                <div className="h-8 sm:h-9 md:h-10 w-12 sm:w-14 md:w-16 relative border rounded bg-gray-50 flex items-center justify-center">
                  <div className="flex">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500 -ml-1 sm:-ml-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center md:text-left">
          <p className="text-xs sm:text-sm text-gray-500">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
