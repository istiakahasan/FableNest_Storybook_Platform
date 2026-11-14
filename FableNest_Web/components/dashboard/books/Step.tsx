"use client";

import { MoveLeft, PlusCircle } from "lucide-react";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Step = () => {
  const router = useRouter();
  const gradientInitial =
    "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  return (
    <div className="space-y-4">
      <DashboardPageHeaderTitle title="Add New Manually" />

      <div className="bg-white  p-4 sm:p-6 md:p-8 rounded-[20px]">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-dashed border-[#F28097]/90 rounded-3xl p-4 sm:p-8 md:p-12 lg:p-16 mb-6 sm:mb-8">
            {/* Plus Icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#F280971A] flex items-center justify-center">
                {/* Icon container with responsive icon sizing */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
                  <PlusCircle className="text-[#F28097] w-full h-full" />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Create your own story book
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto px-2 sm:px-0">
                Start a new adventure with your own story and live the life of
                your dreams
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 border border-[#F28097] text-[#F28097] rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-pink-50 transition-colors w-full sm:w-auto order-2 sm:order-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <MoveLeft className="w-full h-full" />
              </div>
              <span className="whitespace-nowrap">Back To Previews Page</span>
            </button>

            <Link
              href={"/dashboard/books/create/step"}
              className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full sm:w-auto order-1 sm:order-2">
              <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
                <span className="text-white">Create Books</span>
              </div>
              <span
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{ background: gradientHover }}
              />
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                style={{ background: gradientInitial }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step;
