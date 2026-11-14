"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookData } from "./bookData";
import { useTranslations } from "next-intl";

interface BookDetailsProps {
  book: BookData;
}

const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

export default function BookDetails({ book }: BookDetailsProps) {
  const t = useTranslations("BookDetails");
  const router = useRouter();
  const gallery = useMemo(
    () => (book.gallery && book.gallery.length ? book.gallery : [book.image]),
    [book.gallery, book.image]
  );
  const [activeImage, setActiveImage] = useState<string>(gallery[0]);

  const handlePersonalize = () => {
    router.push(`/books/${book.id}/personalize`);
  };

  const discountedPrice = Math.max(
    0,
    Math.round(book.originalPrice * (1 - book.discount / 100) * 100) / 100
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
          {/* Left - Image Gallery */}
          <div className="w-full">
            <div className="bg-white rounded-[18px] sm:rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[450px] bg-white">
                <Image
                  src={activeImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* thumbnails */}
            <div className="mt-4 sm:mt-5 flex flex-wrap gap-3">
              {gallery.slice(0, 5).map((thumb, idx) => {
                const isActive = thumb === activeImage;
                return (
                  <button
                    key={`${thumb}-${idx}`}
                    onClick={() => setActiveImage(thumb)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-18 md:w-24 md:h-[90px] rounded-[20px] overflow-hidden border transition-all ${
                      isActive
                        ? "border-white ring-2 ring-[#9B68F8]/30"
                        : "border-transparent hover:border-[#E6D7FF]"
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <Image
                      src={thumb}
                      alt={`thumb-${idx}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right - Details */}
          <div className="w-full">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#1a1a1a] mb-4 leading-tight font-jost font-semibold">
              {book.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-text-primary font-comme leading-relaxed mb-6">
              {book.subtitle}
            </p>

            {/* Price Section */}
            <div className="mb-8">
              <div className="text-4xl sm:text-4xl font-semibold font-comme text-text-primary mb-2">
                {discountedPrice.toFixed(2)}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg sm:text-xl text-[#636F85] line-through">
                  € {book.originalPrice.toFixed(2)}
                </span>
                <span className="text-sm sm:text-base font-semibold text-text-primary bg-[#F280971A] p-2 rounded-xl">
                  {book.discount}% {t("off")}
                </span>
              </div>
            </div>

            {/* Two Column Layout for Details & Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 mb-8">
              {/* Book Details */}
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-text-primary mb-4 font-comme">
                  {t("bookDetails")}
                </h2>
                <div className="space-y-3 font-comme text-text-primary">
                  <DetailRow label={t("pages")} value={book.pages} />
                  <DetailRow label={t("ageRange")} value={book.ageRange} />
                  <DetailRow label={t("idealFor")} value={book.idealFor} />
                </div>
              </div>

              {/* Facility & Features */}
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-text-primary mb-5 font-comme">
                  {t("facilityFeatures")}
                </h2>
                <ul className="space-y-5 text-text-primary font-comme  text-sm sm:text-base">
                  {book.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-[#1a1a1a] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Personalize Button */}
            <button
              onClick={handlePersonalize}
              className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
            >
              <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                <span className="text-white text-lg">{t("personalize")}</span>
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
    </div>
  );
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-[#636F85] pb-2">
      <span className="text-text-primary font-comme text-sm sm:text-base">
        {label}
      </span>
      <span className="text-text-primary font-comme text-sm sm:text-base">{value}</span>
    </div>
  );
};
