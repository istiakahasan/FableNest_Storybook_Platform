"use client";

import { Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { MdKeyboardArrowDown, MdLanguage } from "react-icons/md";
import toast from "react-hot-toast";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const tToast = useTranslations("ToastMessages");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const shouldRotate = useAppSelector((state) => state.background.shouldRotate);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [mobileLanguageDropdownOpen, setMobileLanguageDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkAuthStatus);

    // Listen for custom event when user logs in/out
    window.addEventListener("auth-change", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("auth-change", checkAuthStatus);
    };
  }, []);


  // Get current locale
  const currentLocale = locale || "en";

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "it", label: "Italian" },
    { code: "sp", label: "Spanish" },
  ];

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/books", label: t("books") },
    { href: "/create-own-book", label: t("createOwnBook") },
  ];

  const profileMenuItems = [
    { href: "/my-account", label: t("myAccount"), isLogout: false },
    { href: "/my-books", label: t("myBooks"), isLogout: false },
    { href: "/my-order", label: t("myOrder"), isLogout: false },
    { href: "/auth/login", label: t("logout"), isLogout: true },
  ];

  const handleLogout = () => {
    // Store current route before logging out
    if (typeof window !== "undefined") {
      // Only store if it's not an auth page
      if (pathname && !pathname.includes("/auth/")) {
        sessionStorage.setItem("logoutReferrer", pathname);
      } else {
        // If on auth page, use home as default
        sessionStorage.setItem("logoutReferrer", "/");
      }
      
      // Clear access token (keep rememberedEmail for Remember Me functionality)
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      // Dispatch custom event to update other components
      window.dispatchEvent(new Event("auth-change"));
    }
    toast.success(tToast("loggedOutSuccess"));
    setProfileDropdownOpen(false);
    // Redirect to login page
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
  };

  // Dynamic colors based on Redux state
  const svgFillColor = shouldRotate ? "#ffffff" : "#2D2D2D";
  const logoSrc = shouldRotate ? "/logos/whiteLogo.png" : "/logos/blackLogo.png";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: string) => {
    router.replace(pathname, { locale: code });
    setLanguageDropdownOpen(false);
  };

  // Check if link is active
  const isLinkActive = (href: string) => {
    // Remove locale prefix from pathname if present (e.g., /en/books -> /books)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

    // For home page, check exact match
    if (href === "/") {
      return pathWithoutLocale === "/" || pathWithoutLocale === "";
    }

    // For other routes, check if pathname starts with the href (handles nested routes)
    return pathWithoutLocale.startsWith(href);
  };

  const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";


    const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Navbar Container */}
      <nav
        className={clsx(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "backdrop-blur-3xl max-w-[1440px] lg:w-[95%] mx-auto lg:rounded-full lg:top-3"
            : "bg-transparent max-w-[1440px] lg:w-[95%] mx-auto lg:rounded-full"
        )}
        style={
          isScrolled
            ? {
                backgroundColor: shouldRotate ? "#00000020" : "#ffffff20",
              }
            : undefined
        }>
        <div className="max-w-[1280px] mx-auto w-[95%] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group w-1/4">
            <Image
              src={logoSrc}
              alt="company-logo"
              width={100}
              height={100}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 hvr-float-shadow"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 w-1/2 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 sm:px-4 py-2 rounded-lg font-comme text-sm sm:text-base font-medium transition-all duration-200",
                  isLinkActive(link.href)
                    ? "text-[#F28097]"
                    : shouldRotate
                      ? "text-white hover:text-[#F28097]/90"
                      : "text-text-primary hover:text-[#F28097]/90"
                )}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex justify-end items-center gap-3 sm:gap-4 w-1/4">

            {/* Language Switcher - Show only when logged in */}
            {isLoggedIn && (
              <div className="relative hidden lg:block" ref={languageDropdownRef}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className={clsx(
                    "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200",
                    shouldRotate
                      ? "text-white hover:bg-white/10"
                      : "text-text-primary hover:bg-gray-100"
                  )}
                  aria-label="Language Menu">
                  <MdLanguage className="w-6 h-6" />
                  <span className="text-sm font-medium uppercase">{currentLocale}</span>
                  <MdKeyboardArrowDown
                    className={clsx(
                      "w-4 h-4 transition-transform duration-200",
                      languageDropdownOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* Language Dropdown Menu */}
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn border border-gray-200">
                    {languages.map((language, index) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                        className={clsx(
                          "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                          index !== languages.length - 1 ? "border-b border-gray-100" : "",
                          currentLocale === language.code
                            ? "bg-gray-50 font-semibold text-gray-900"
                            : "text-gray-700"
                        )}>
                        <span className="font-medium">{language.label}</span>
                        {currentLocale === language.code && (
                          <span className="text-[#F28097]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Icon - Show only when logged in */}
            {isLoggedIn && (
              <Link href="/cart" className="hidden lg:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                  <path
                    d="M22.3125 28.125H7.6875C4.59375 28.125 2.0625 25.5938 2.0625 22.5V22.3125L2.625 7.3125C2.71875 4.21875 5.25 1.875 8.25 1.875H21.75C24.75 1.875 27.2812 4.21875 27.375 7.3125L27.9375 22.3125C28.0312 23.8125 27.4688 25.2188 26.4375 26.3438C25.4062 27.4688 24 28.125 22.5 28.125H22.3125ZM8.25 3.75C6.1875 3.75 4.59375 5.34375 4.5 7.3125L3.9375 22.5C3.9375 24.5625 5.625 26.25 7.6875 26.25H22.5C23.5312 26.25 24.4687 25.7812 25.125 25.0312C25.7812 24.2812 26.1562 23.3438 26.1562 22.3125L25.5937 7.3125C25.5 5.25 23.9062 3.75 21.8437 3.75H8.25Z"
                    fill={svgFillColor}
                  />
                  <path
                    d="M15 13.125C11.3438 13.125 8.4375 10.2188 8.4375 6.5625C8.4375 6 8.8125 5.625 9.375 5.625C9.9375 5.625 10.3125 6 10.3125 6.5625C10.3125 9.1875 12.375 11.25 15 11.25C17.625 11.25 19.6875 9.1875 19.6875 6.5625C19.6875 6 20.0625 5.625 20.625 5.625C21.1875 5.625 21.5625 6 21.5625 6.5625C21.5625 10.2188 18.6562 13.125 15 13.125Z"
                    fill={svgFillColor}
                  />
                </svg>
              </Link>
            )}

            {/* Sign Up and Login Buttons - Show only when NOT logged in */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/auth/signup"
                  onClick={() => {
                    // Store current pathname as referrer
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("signupReferrer", pathname || "/");
                    }
                  }}
                  className="relative px-4 sm:px-6 font-dynapuff py-2 sm:py-2.5 md:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden border border-white">
                  <span className="relative z-10 text-white text-nowrap">{t("signUp")}</span>
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ background: gradientInitial }}
                  />
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                    style={{ background: gradientHover }}
                  />
                </Link>

                <Link
                  href="/auth/login"
                  onClick={() => {
                    // Store current pathname as referrer
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("loginReferrer", pathname || "/");
                    }
                  }}
                  className="relative px-4 sm:px-6 py-2 font-dynapuff sm:py-2.5 md:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden border border-white">
                  <span className="relative z-10 text-white">{t("login")}</span>
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ background: gradientInitial }}
                  />
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                    style={{ background: gradientHover }}
                  />
                </Link>
              </>
            )}

            {/* Profile Icon with Dropdown - Show only when logged in */}
            {isLoggedIn && (
              <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Profile Menu">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill={svgFillColor}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mt-2">
                  <path
                    d="M15 14.6875C18.275 14.6875 20.9375 12.025 20.9375 8.75C20.9375 5.475 18.275 2.8125 15 2.8125C11.725 2.8125 9.0625 5.475 9.0625 8.75C9.0625 12.025 11.725 14.6875 15 14.6875ZM15 4.6875C17.2375 4.6875 19.0625 6.5125 19.0625 8.75C19.0625 10.9875 17.2375 12.8125 15 12.8125C12.7625 12.8125 10.9375 10.9875 10.9375 8.75C10.9375 6.5125 12.7625 4.6875 15 4.6875ZM18.75 16.5625H11.25C7.2875 16.5625 4.0625 19.7875 4.0625 23.75C4.0625 25.65 5.6 27.1875 7.5 27.1875H22.5C24.4 27.1875 25.9375 25.65 25.9375 23.75C25.9375 19.7875 22.7125 16.5625 18.75 16.5625ZM22.5 25.3125H7.5C6.6375 25.3125 5.9375 24.6125 5.9375 23.75C5.9408 22.3421 6.50157 20.9927 7.49714 19.9971C8.49271 19.0016 9.84205 18.4408 11.25 18.4375H18.75C20.1579 18.4408 21.5073 19.0016 22.5029 19.9971C23.4984 20.9927 24.0592 22.3421 24.0625 23.75C24.0625 24.6125 23.3625 25.3125 22.5 25.3125Z"
                    fill={svgFillColor}
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn">
                  {profileMenuItems.map((item) =>
                    item.isLogout ? (
                      <button
                        key={item.href}
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm font-medium transition-colors font-comme border-b border-gray-100 last:border-b-0 text-red-600 hover:bg-red-50"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setProfileDropdownOpen(false)}
                        className={clsx(
                          "block px-4 py-3 text-sm font-medium transition-colors font-comme border-b border-gray-100 last:border-b-0",
                          isLinkActive(item.href)
                            ? "bg-[#F28097]/10 text-[#443BC9]"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              )}
              </div>
            )}
          </div>
          {/* End Desktop Auth Buttons */}

          {/* Mobile Menu Button */}
          <button
            className={clsx(
              "lg:hidden p-2 rounded-lg transition-all duration-200",
              isScrolled
                ? "bg-white/10 hover:bg-white/20"
                : "bg-white/5 hover:bg-white/10"
            )}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Menu">
            <Menu className={clsx("w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200", shouldRotate ? "text-white" : "text-text-primary")} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full z-50 w-full max-w-xs sm:max-w-sm bg-linear-to-b from-gray-900 to-black shadow-2xl transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
        <div className="flex flex-col h-full p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <Image
                src={logoSrc}
                alt="company-logo"
                width={40}
                height={40}
                className="w-14 h-14 sm:w-20 sm:h-20"
              />
              <span className={clsx("text-lg sm:text-xl font-bold transition-colors duration-200", shouldRotate ? "text-white" : "text-white")}>
                Face2toon
              </span>

              {/* Language Switcher - Show only when logged in */}
              {isLoggedIn && (
                <div className="relative lg:hidden ml-2" ref={mobileLanguageDropdownRef}>
              <button
                onClick={() => setMobileLanguageDropdownOpen(!mobileLanguageDropdownOpen)}
                className={clsx(
                  "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200",
                  shouldRotate
                    ? "text-white hover:bg-white/10"
                    : "text-white hover:bg-gray-100"
                )}
                aria-label="Language Menu">
                <MdLanguage className="w-6 h-6" />
                <span className="text-xs font-medium uppercase">{currentLocale}</span>
                <MdKeyboardArrowDown
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200",
                    mobileLanguageDropdownOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {/* Language Dropdown Menu */}
              {mobileLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn border border-gray-200">
                  {languages.map((language, index) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                        index !== languages.length - 1 ? "border-b border-gray-100" : "",
                        currentLocale === language.code
                          ? "bg-gray-50 font-semibold text-gray-900"
                          : "text-gray-700"
                      )}>
                      <span className="font-medium">{language.label}</span>
                      {currentLocale === language.code && (
                        <span className="text-[#F28097]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Menu">
              <X className={clsx("w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200", shouldRotate ? "text-white" : "text-white")} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                    isLinkActive(link.href)
                      ? "text-white bg-linear-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setSidebarOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Profile Menu - Show only when logged in */}
            {isLoggedIn && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-4">
                  Account
                </h3>
                <div className="flex flex-col gap-1">
                  {profileMenuItems.map((item) =>
                    item.isLogout ? (
                      <button
                        key={item.href}
                        onClick={() => {
                          setSidebarOpen(false);
                          handleLogout();
                        }}
                        className="px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          "px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                          isLinkActive(item.href)
                            ? "text-white bg-linear-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Mobile Sign Up and Login Buttons - Show only when NOT logged in */}
            {!isLoggedIn && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col gap-3 sm:gap-4">
                <Link
                  href="/auth/signup"
                  onClick={() => {
                    setSidebarOpen(false);
                    // Store current pathname as referrer
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("signupReferrer", pathname || "/");
                    }
                  }}
                  className="relative px-4 sm:px-5 font-dynapuff md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden border border-white mx-4">
                  <span className="relative z-10 text-white text-nowrap">{t("signUp")}</span>
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ background: gradientInitial }}
                  />
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                    style={{ background: gradientHover }}
                  />
                </Link>

                <Link
                  href="/auth/login"
                  onClick={() => {
                    setSidebarOpen(false);
                    // Store current pathname as referrer
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("loginReferrer", pathname || "/");
                    }
                  }}
                  className="relative px-4 sm:px-5 md:px-6 py-2 font-dynapuff sm:py-2.5 md:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group/login overflow-hidden border border-white mx-4">
                  <span className="relative z-10 text-white">{t("login")}</span>
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ background: gradientInitial }}
                  />
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                    style={{ background: gradientHover }}
                  />
                </Link>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              © {new Date().getFullYear()} Face2toon. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;