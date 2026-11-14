"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  User,
  Globe,
  Plus,
  MarsStroke,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import { useGetAllBookQuery } from "@/store/api/bookApi";
import ErrorComponent from "@/components/shared/ErrorComponent";

/* =======================
   Types (API-based)
======================= */

interface Book {
  id: string;
  title: string;
  characterName: string;
  coverImageUrl: string;
  characterAge: number;
  gender: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

/* =======================
   Constants
======================= */

const GENDER_OPTIONS = ["All", "Male", "Female"] as const;
const AGE_OPTIONS = [
  "All",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
] as const;

const LANGUAGE_OPTIONS = [
  "ALL",
  "ARABIC",
  "English",
  "FRENCH",
  "ITALIAN",
  "SPANISH",
] as const;

const DEFAULT_ITEMS_PER_PAGE = 8;
const DEBOUNCE_DELAY = 200;

/* =======================
   Helper Functions & Hooks
======================= */

const getAgeLabel = (age: number): string => {
  return `Age ${age}`;
};

const formatBookTitle = (
  title: string,
): { firstWord: string; rest: string } => {
  const words = title.split(" ");
  const firstWord = words[0] || "";
  const rest = words.slice(1).join(" ") || "";
  return { firstWord, rest };
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/* =======================
   Reusable Components
======================= */

interface FilterButtonProps {
  icon: React.ElementType;
  label: string;
  options: readonly string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const FilterButton = React.memo(
  ({
    icon: Icon,
    label,
    options,
    selectedValue,
    onSelect,
  }: FilterButtonProps) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors min-w-[140px] justify-between text-sm font-medium"
          aria-label={`Filter by ${label}`}>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="">
              {(selectedValue === "All" ? label : selectedValue)
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[140px] bg-white border border-gray-200 shadow-lg rounded-lg"
        align="start">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSelect(option)}
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ">
            {option
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
);

FilterButton.displayName = "FilterButton";

interface BookCardProps {
  book: Book;
}

const gradientInitial =
  "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";

const BookCard = React.memo(({ book }: BookCardProps) => {
  const ageLabel = getAgeLabel(book.characterAge);
  const { firstWord, rest } = formatBookTitle(book.title);

  const imageSrc =
    book.coverImageUrl === "PENDING"
      ? "/collection/b-baby.png"
      : book.coverImageUrl;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 relative group hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative aspect-[4/5] w-full">
        <div className="w-full h-full rounded-xl overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={imageSrc}
            alt={`Cover image for ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            unoptimized
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div className="absolute top-6 left-0 right-0 text-center px-4">
            <h3 className="text-white font-black text-2xl drop-shadow-lg font-serif">
              {firstWord}
            </h3>
            {rest && (
              <p className="text-white font-bold text-lg drop-shadow-lg mt-1">
                {rest}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="font-bold text-gray-800 text-base line-clamp-2">
          {book.characterName}
        </h3>
        <p className="text-xs text-gray-500 font-medium">{book.language}</p>
        <p className="text-sm font-semibold text-gray-700 mt-1">{ageLabel}</p>
      </div>

      <button className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full sm:w-auto order-1 sm:order-2">
        <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
          <span className="text-white">Edit Details</span>
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
  );
});

BookCard.displayName = "BookCard";

interface BookCardSkeletonProps {
  count?: number;
}

const BookCardSkeleton = React.memo(({ count = 12 }: BookCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 border border-gray-100 animate-pulse">
          <div className="relative aspect-[4/5] w-full">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-200" />
          </div>

          <div className="flex flex-col gap-1.5 px-1">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-1" />
          </div>

          <div className="w-full mt-1 py-3 rounded-lg bg-gray-200" />
        </div>
      ))}
    </>
  );
});

BookCardSkeleton.displayName = "BookCardSkeleton";

/* =======================
   Main Component
======================= */

export default function BooksContent() {
  // State Management
  const [selectedGender, setSelectedGender] = useState<string>(
    GENDER_OPTIONS[0],
  );
  const [selectedAge, setSelectedAge] = useState<string>(AGE_OPTIONS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    LANGUAGE_OPTIONS[0],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    DEFAULT_ITEMS_PER_PAGE,
  );

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const buildQueryParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {
      page: String(currentPage),
      limit: String(itemsPerPage),
    };

    if (debouncedSearchQuery) {
      params.searchTerm = debouncedSearchQuery;
    }

    if (selectedGender !== "All") {
      params.gender = selectedGender;
    }

    if (selectedLanguage !== "All") {
      params.language = selectedLanguage;
    }

    if (selectedAge !== "All") {
      params.characterAge = selectedAge;
    }

    return params;
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    selectedGender,
    selectedLanguage,
    selectedAge,
  ]);

  // API Query
  const queryParams = buildQueryParams();
  const { data, isLoading, isError, error } = useGetAllBookQuery(queryParams, {
    skip: false,
  });

  // Derived state
  const books = data?.data ?? [];
  const meta = data?.meta;
  const totalItems = meta?.total ?? 0;
  const showPagination = totalItems > itemsPerPage;

  // Handle filter changes - reset page without useEffect
  const handleFilterChange = useCallback(
    (filterType: "gender" | "age" | "language" | "search", value: string) => {
      // Reset to first page when filters change
      setCurrentPage(1);

      // Set the specific filter
      switch (filterType) {
        case "gender":
          setSelectedGender(value);
          break;
        case "age":
          setSelectedAge(value);
          break;
        case "language":
          setSelectedLanguage(value);
          break;
        case "search":
          setSearchQuery(value);
          break;
      }
    },
    [],
  );

  // Memoized handlers
  const handleGenderSelect = useCallback(
    (value: string) => {
      handleFilterChange("gender", value);
    },
    [handleFilterChange],
  );

  const handleAgeSelect = useCallback(
    (value: string) => {
      handleFilterChange("age", value);
    },
    [handleFilterChange],
  );

  const handleLanguageSelect = useCallback(
    (value: string) => {
      handleFilterChange("language", value);
    },
    [handleFilterChange],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFilterChange("search", e.target.value);
    },
    [handleFilterChange],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  }, []);

  // Determine items per page for skeleton
  const skeletonCount = itemsPerPage || DEFAULT_ITEMS_PER_PAGE;

  // Loading and Error States
  if (isLoading && currentPage === 1 && !data) {
    return (
      <div className="space-y-8">
        <DashboardPageHeaderTitle title="Customize & Upload New Books" />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Books"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                aria-label="Search books"
              />
            </div>

            <FilterButton
              icon={MarsStroke}
              label="Gender"
              options={GENDER_OPTIONS}
              selectedValue={selectedGender}
              onSelect={handleGenderSelect}
            />
            <FilterButton
              icon={User}
              label="Child Age"
              options={AGE_OPTIONS}
              selectedValue={selectedAge}
              onSelect={handleAgeSelect}
            />
            <FilterButton
              icon={Globe}
              label="Language"
              options={LANGUAGE_OPTIONS}
              selectedValue={selectedLanguage}
              onSelect={handleLanguageSelect}
            />
          </div>

          <Link
            href="/dashboard/books/daily-book"
            className="px-4 py-2.5 bg-[#73B7FF] text-white rounded-lg flex items-center gap-2 hover:bg-[#5CA8FF] transition-colors"
            aria-label="Add new books">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M9.1071 5.448C9.7051 3.698 12.1231 3.645 12.8321 5.289L12.8921 5.449L13.6991 7.809C13.884 8.35023 14.1829 8.84551 14.5755 9.26142C14.9682 9.67734 15.4454 10.0042 15.9751 10.22L16.1921 10.301L18.5521 11.107C20.3021 11.705 20.3551 14.123 18.7121 14.832L18.5521 14.892L16.1921 15.699C15.6507 15.8838 15.1552 16.1826 14.7391 16.5753C14.323 16.9679 13.996 17.4452 13.7801 17.975L13.6991 18.191L12.8931 20.552C12.2951 22.302 9.8771 22.355 9.1691 20.712L9.1071 20.552L8.3011 18.192C8.11628 17.6506 7.81748 17.1551 7.42485 16.739C7.03222 16.3229 6.5549 15.9959 6.0251 15.78L5.8091 15.699L3.4491 14.893C1.6981 14.295 1.6451 11.877 3.2891 11.169L3.4491 11.107L5.8091 10.301C6.35034 10.1161 6.84562 9.81719 7.26153 9.42457C7.67744 9.03195 8.00432 8.55469 8.2201 8.025L8.3011 7.809L9.1071 5.448ZM19.0001 2C19.1872 2 19.3705 2.05248 19.5293 2.15147C19.688 2.25046 19.8158 2.392 19.8981 2.56L19.9461 2.677L20.2961 3.703L21.3231 4.053C21.5106 4.1167 21.6749 4.23462 21.7953 4.39182C21.9157 4.54902 21.9867 4.73842 21.9994 4.93602C22.012 5.13362 21.9657 5.33053 21.8663 5.50179C21.7669 5.67304 21.6189 5.81094 21.4411 5.898L21.3231 5.946L20.2971 6.296L19.9471 7.323C19.8833 7.51043 19.7653 7.6747 19.608 7.79499C19.4508 7.91529 19.2613 7.98619 19.0637 7.99872C18.8661 8.01125 18.6693 7.96484 18.4981 7.86538C18.3269 7.76591 18.1891 7.61787 18.1021 7.44L18.0541 7.323L17.7041 6.297L16.6771 5.947C16.4896 5.8833 16.3253 5.76538 16.2049 5.60819C16.0845 5.45099 16.0135 5.26158 16.0008 5.06398C15.9882 4.86638 16.0345 4.66947 16.1339 4.49821C16.2333 4.32696 16.3813 4.18906 16.5591 4.102L16.6771 4.054L17.7031 3.704L18.0531 2.677C18.1205 2.47943 18.2481 2.30791 18.4179 2.1865C18.5878 2.06509 18.7913 1.99987 19.0001 2Z"
                fill="white"
              />
            </svg>
            AI Generated Books
          </Link>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <BookCardSkeleton count={skeletonCount} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <DashboardPageHeaderTitle title="Customize & Upload New Books" />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Books"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                aria-label="Search books"
              />
            </div>

            <FilterButton
              icon={MarsStroke}
              label="Gender"
              options={GENDER_OPTIONS}
              selectedValue={selectedGender}
              onSelect={handleGenderSelect}
            />
            <FilterButton
              icon={User}
              label="Child Age"
              options={AGE_OPTIONS}
              selectedValue={selectedAge}
              onSelect={handleAgeSelect}
            />
            <FilterButton
              icon={Globe}
              label="Language"
              options={LANGUAGE_OPTIONS}
              selectedValue={selectedLanguage}
              onSelect={handleLanguageSelect}
            />
          </div>

          <Link
            href="/dashboard/books/daily-book"
            className="px-4 py-2.5 bg-[#73B7FF] text-white rounded-lg flex items-center gap-2 hover:bg-[#5CA8FF] transition-colors"
            aria-label="Add new books">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M9.1071 5.448C9.7051 3.698 12.1231 3.645 12.8321 5.289L12.8921 5.449L13.6991 7.809C13.884 8.35023 14.1829 8.84551 14.5755 9.26142C14.9682 9.67734 15.4454 10.0042 15.9751 10.22L16.1921 10.301L18.5521 11.107C20.3021 11.705 20.3551 14.123 18.7121 14.832L18.5521 14.892L16.1921 15.699C15.6507 15.8838 15.1552 16.1826 14.7391 16.5753C14.323 16.9679 13.996 17.4452 13.7801 17.975L13.6991 18.191L12.8931 20.552C12.2951 22.302 9.8771 22.355 9.1691 20.712L9.1071 20.552L8.3011 18.192C8.11628 17.6506 7.81748 17.1551 7.42485 16.739C7.03222 16.3229 6.5549 15.9959 6.0251 15.78L5.8091 15.699L3.4491 14.893C1.6981 14.295 1.6451 11.877 3.2891 11.169L3.4491 11.107L5.8091 10.301C6.35034 10.1161 6.84562 9.81719 7.26153 9.42457C7.67744 9.03195 8.00432 8.55469 8.2201 8.025L8.3011 7.809L9.1071 5.448ZM19.0001 2C19.1872 2 19.3705 2.05248 19.5293 2.15147C19.688 2.25046 19.8158 2.392 19.8981 2.56L19.9461 2.677L20.2961 3.703L21.3231 4.053C21.5106 4.1167 21.6749 4.23462 21.7953 4.39182C21.9157 4.54902 21.9867 4.73842 21.9994 4.93602C22.012 5.13362 21.9657 5.33053 21.8663 5.50179C21.7669 5.67304 21.6189 5.81094 21.4411 5.898L21.3231 5.946L20.2971 6.296L19.9471 7.323C19.8833 7.51043 19.7653 7.6747 19.608 7.79499C19.4508 7.91529 19.2613 7.98619 19.0637 7.99872C18.8661 8.01125 18.6693 7.96484 18.4981 7.86538C18.3269 7.76591 18.1891 7.61787 18.1021 7.44L18.0541 7.323L17.7041 6.297L16.6771 5.947C16.4896 5.8833 16.3253 5.76538 16.2049 5.60819C16.0845 5.45099 16.0135 5.26158 16.0008 5.06398C15.9882 4.86638 16.0345 4.66947 16.1339 4.49821C16.2333 4.32696 16.3813 4.18906 16.5591 4.102L16.6771 4.054L17.7031 3.704L18.0531 2.677C18.1205 2.47943 18.2481 2.30791 18.4179 2.1865C18.5878 2.06509 18.7913 1.99987 19.0001 2Z"
                fill="white"
              />
            </svg>
            AI Generated Books
          </Link>
        </div>

        {/* Error State */}
        <ErrorComponent error={error} fullScreen />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeaderTitle title="Customize & Upload New Books" />

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Books"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              aria-label="Search books"
            />
          </div>

          <FilterButton
            icon={MarsStroke}
            label="Gender"
            options={GENDER_OPTIONS}
            selectedValue={selectedGender}
            onSelect={handleGenderSelect}
          />
          <FilterButton
            icon={User}
            label="Child Age"
            options={AGE_OPTIONS}
            selectedValue={selectedAge}
            onSelect={handleAgeSelect}
          />
          <FilterButton
            icon={Globe}
            label="Language"
            options={LANGUAGE_OPTIONS}
            selectedValue={selectedLanguage}
            onSelect={handleLanguageSelect}
          />
        </div>

        <Link
          href="/dashboard/books/daily-book"
          className="px-4 py-2.5 bg-[#73B7FF] text-white rounded-lg flex items-center gap-2 hover:bg-[#5CA8FF] transition-colors"
          aria-label="Add new books">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M9.1071 5.448C9.7051 3.698 12.1231 3.645 12.8321 5.289L12.8921 5.449L13.6991 7.809C13.884 8.35023 14.1829 8.84551 14.5755 9.26142C14.9682 9.67734 15.4454 10.0042 15.9751 10.22L16.1921 10.301L18.5521 11.107C20.3021 11.705 20.3551 14.123 18.7121 14.832L18.5521 14.892L16.1921 15.699C15.6507 15.8838 15.1552 16.1826 14.7391 16.5753C14.323 16.9679 13.996 17.4452 13.7801 17.975L13.6991 18.191L12.8931 20.552C12.2951 22.302 9.8771 22.355 9.1691 20.712L9.1071 20.552L8.3011 18.192C8.11628 17.6506 7.81748 17.1551 7.42485 16.739C7.03222 16.3229 6.5549 15.9959 6.0251 15.78L5.8091 15.699L3.4491 14.893C1.6981 14.295 1.6451 11.877 3.2891 11.169L3.4491 11.107L5.8091 10.301C6.35034 10.1161 6.84562 9.81719 7.26153 9.42457C7.67744 9.03195 8.00432 8.55469 8.2201 8.025L8.3011 7.809L9.1071 5.448ZM19.0001 2C19.1872 2 19.3705 2.05248 19.5293 2.15147C19.688 2.25046 19.8158 2.392 19.8981 2.56L19.9461 2.677L20.2961 3.703L21.3231 4.053C21.5106 4.1167 21.6749 4.23462 21.7953 4.39182C21.9157 4.54902 21.9867 4.73842 21.9994 4.93602C22.012 5.13362 21.9657 5.33053 21.8663 5.50179C21.7669 5.67304 21.6189 5.81094 21.4411 5.898L21.3231 5.946L20.2971 6.296L19.9471 7.323C19.8833 7.51043 19.7653 7.6747 19.608 7.79499C19.4508 7.91529 19.2613 7.98619 19.0637 7.99872C18.8661 8.01125 18.6693 7.96484 18.4981 7.86538C18.3269 7.76591 18.1891 7.61787 18.1021 7.44L18.0541 7.323L17.7041 6.297L16.6771 5.947C16.4896 5.8833 16.3253 5.76538 16.2049 5.60819C16.0845 5.45099 16.0135 5.26158 16.0008 5.06398C15.9882 4.86638 16.0345 4.66947 16.1339 4.49821C16.2333 4.32696 16.3813 4.18906 16.5591 4.102L16.6771 4.054L17.7031 3.704L18.0531 2.677C18.1205 2.47943 18.2481 2.30791 18.4179 2.1865C18.5878 2.06509 18.7913 1.99987 19.0001 2Z"
              fill="white"
            />
          </svg>
          AI Generated Books
        </Link>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {debouncedSearchQuery ||
          selectedGender !== "All" ||
          selectedAge !== "All" ||
          selectedLanguage !== "All"
            ? "No books found matching your filters."
            : "No books available. Add your first book!"}
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <Link
          href="/dashboard/books/create"
          className="px-4 py-2.5 bg-[#73B7FF] text-white rounded-lg flex items-center gap-2 hover:bg-[#5CA8FF] transition-colors"
          aria-label="Add new books">
          <Plus className="w-5 h-5" aria-hidden="true" />
          Add New Books
        </Link>
      </div>

      {/* Pagination */}
      {showPagination && meta && (
        <Pagination
          totalItems={totalItems}
          initialPage={currentPage}
          initialItemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
