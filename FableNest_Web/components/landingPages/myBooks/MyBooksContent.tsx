"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { booksData } from "../bookPage/bookData";
import BrowseStoriesByAgeSection from "../homePage/BrowseStoriesByAgeSection";
import { useTranslations } from "next-intl";

interface MyBook {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  discount: number;
  childName: string;
  childAge: number;
}

// Mock data for user's personalized books
const myBooksData: MyBook[] = [
  {
    id: 1,
    title: "THEODORE'S smile",
    subtitle: "Princess! We've been waiting for you",
    image: "/book_imgs/book1.png",
    discount: 20,
    childName: "Ibnur",
    childAge: 6,
  },
  {
    id: 2,
    title: "JUSTIN The Dinos Need You",
    subtitle: "Princess! We've been waiting for you",
    image: "/book_imgs/book2.png",
    discount: 20,
    childName: "Ibnur",
    childAge: 6,
  },
];

const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

export default function MyBooksContent() {
  const t = useTranslations("MyBooksContent");
  const router = useRouter();

  const handlePersonalise = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  return (
    <div className="relative max-w-[1280px] mx-auto w-[95%] mt-20 sm:mt-28 md:mt-32 lg:mt-[180px]">
      <div className="relative z-10 ">
        {/* My Books Section */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary font-jost mb-6 sm:mb-8 md:mb-10">
            {t("myBooks")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBooksData.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl w-full p-5 sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Book Cover with Discount Badge */}
                <div className="relative w-full bg-gray-100 mb-[10px] max-h-[371px] h-[371px]">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover max-h-[371px] rounded-2xl"
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
                  <p className="text-sm sm:text-base mb-[10px] line-clamp-1 font-comme text-text-sec">
                    {book.subtitle}
                  </p>
                  <p className="text-xs sm:text-base mb-5 sm:mb-6 font-semibold font-comme text-text-primary">
                    {t("name")}: {book.childName} {t("age")}: {book.childAge}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add new book to your collection Section */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary font-jost">
              {t("addNewBookToCollection")}
            </h2>
            <button
              className="relative cursor-pointer inline-flex items-center justify-center gap-2 z-10 translate-y-[3px] px-4 sm:px-5 md:px-6 py-2 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 overflow-hidden border border-white shadow-lg hover:shadow-xl active:scale-[0.98] group w-fit"
              aria-label="View all books"
            >
              <span className="relative z-10 text-white font-dynapuff flex items-center gap-2">
                {t("viewAll")} <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.71057 18.2929C10.1011 18.6834 10.7343 18.6834 11.1248 18.2929L16.0122 13.4006C16.7926 12.6195 16.7923 11.3537 16.0116 10.5729L11.1212 5.68254C10.7307 5.29202 10.0975 5.29202 9.70696 5.68254C9.31643 6.07307 9.31643 6.70623 9.70696 7.09676L13.8926 11.2824C14.2832 11.6729 14.2832 12.3061 13.8926 12.6966L9.71057 16.8787C9.32004 17.2692 9.32004 17.9023 9.71057 18.2929Z" fill="white"/>
</svg>
</span>
              </span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {booksData.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl w-full p-5 sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Book Cover with Discount Badge */}
                <div className="relative w-full bg-gray-100 mb-[10px] max-h-[371px] h-[371px]">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover max-h-[371px] rounded-2xl"
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
                  <p className="text-sm sm:text-base mb-[10px] line-clamp-1 font-comme text-text-sec">
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
                      <span className="text-white">{t("personalise")}</span>
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
        </div>

        <BrowseStoriesByAgeSection/>
      </div>
    </div>
  );
}

