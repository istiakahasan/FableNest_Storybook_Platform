"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getBookCreationData } from "@/utils/bookCreationData";
import { useGetMyOrdersQuery } from "@/store/api/orderApi";
import { useCreateRestBookMutation } from "@/store/api/bookApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const t = useTranslations("PaymentSuccess");
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const { data: ordersData, isLoading: isOrdersLoading } = useGetMyOrdersQuery();
  const [createRestBook, { isLoading: isGenerating }] = useCreateRestBookMutation();
  const [generatedBooks, setGeneratedBooks] = useState<Set<string>>(new Set());

  const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  // Generate rest pages for books in the order
  useEffect(() => {
    const generateRestPages = async () => {
      if (!orderId || !ordersData?.data) {
        return;
      }

      // Find the order by orderId
      const order = ordersData.data.find((o) => o.id === orderId);
      if (!order) {
        console.log("Order not found:", orderId);
        return;
      }

      // Generate rest pages for each book in the order
      for (const orderItem of order.orderItem) {
        const bookId = orderItem.book.id;
        
        // Skip if already generated
        if (generatedBooks.has(bookId)) {
          continue;
        }

        try {
          // Check if book ID matches (this is the verification step)
          if (bookId) {
            console.log(`Generating rest pages for book: ${bookId}`);
            
            const result = await createRestBook(bookId).unwrap();
            
            if (result.success) {
              console.log(`Rest pages generated successfully for book: ${bookId}`);
              setGeneratedBooks((prev) => new Set(prev).add(bookId));
              toast.success(`Rest pages generated for ${orderItem.book.title}`);
            }
          }
        } catch (error: unknown) {
          console.error(`Error generating rest pages for book ${bookId}:`, error);
          const errorData = error as { data?: { message?: string }; message?: string };
          const errorMessage = 
            errorData?.data?.message || 
            errorData?.message || 
            `Failed to generate rest pages for ${orderItem.book.title}`;
          toast.error(errorMessage);
        }
      }
    };

    if (!isOrdersLoading && ordersData?.data) {
      generateRestPages();
    }
  }, [orderId, ordersData, isOrdersLoading, createRestBook, generatedBooks]);

  // Check if this is from create-own-book flow - book is already created, just show success
  useEffect(() => {
    const bookData = getBookCreationData();
    
    // If book is already created (has bookId), we're done
    if (bookData.bookId && bookData.previewImages) {
      // Book was already created in StoryIdeaPage, just show success
      console.log("Book already created:", bookData.bookId);
    }
  }, []);

  const handleReviewBook = () => {
    const bookData = getBookCreationData();
    
    // If from create-own-book flow, go to preview
    if (bookData.bookId && bookData.previewImages) {
      router.push("/create-own-book/preview?payment=success");
    } else {
      // Otherwise, go to regular book preview
      router.push("/books/1/preview");
    }
  };

  return (
    <div className="relative lg:mt-[280px] md:mt-[150px] sm:mt-[100px] mt-20">


      <div className="relative z-10 max-w-[1280px] w-[95%] mx-auto text-center">

        <div className="relative w-[335px] h-[270px] mx-auto">
          <Image src="/success.png" alt="Payment Success" fill className="object-contain mx-auto hvr-float-shadow" />

        </div>
        {/* Text Content */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-text-primary mt-6 mb-4 sm:mb-6">
          {t("paymentSuccessful")}
        </h1>
        <p className="lg:text-xl text-text-secondary font-comme mt-8 mb-4">
        {t("reviewRegenerateMessage")}
        </p>

        {/* Generating Status */}
        {(isGenerating || isOrdersLoading) && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-[#F28097]" />
            <span className="text-text-secondary font-comme">
              Generating rest pages...
            </span>
          </div>
        )}

        {/* CTA Button */}
        <button
          style={{ background: gradientInitial }}
          onClick={handleReviewBook}
          disabled={isGenerating || isOrdersLoading}
          className="relative w-fit px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
            <span className="text-white text-sm sm:text-lg">
              {t("reviewApprovePrint")}
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
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

