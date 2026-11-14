"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface OrderItem {
    id: number;
    bookTitle: string;
    bookImage: string;
    childName: string;
    childAge: number;
    pages: number;
    language: string;
    orderDate: string;
    orderId: string;
    status: string;
    price: number;
}

// Mock order data
const ordersData: OrderItem[] = [
    {
        id: 1,
        bookTitle: "The adventure of Rakib to the amazon jungle",
        bookImage: "/book_imgs/book1.png",
        childName: "Rakib",
        childAge: 11,
        pages: 20,
        language: "English",
        orderDate: "10-12-2025",
        orderId: "#3472234",
        status: "Shipped",
        price: 30.0,
    },
    {
        id: 2,
        bookTitle: "The adventure of Rakib to the amazon jungle",
        bookImage: "/book_imgs/book2.png",
        childName: "Rakib",
        childAge: 11,
        pages: 20,
        language: "English",
        orderDate: "10-12-2025",
        orderId: "#3472234",
        status: "Shipped",
        price: 30.0,
    },
];

const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

export default function MyOrderContent() {
  const t = useTranslations("MyOrderContent");
  const router = useRouter();

  const handleTrackOrder = (orderId: string) => {
    router.push(`/my-order/track?orderId=${orderId}`);
  };

  return (
        <div className="relative max-w-[1280px] mx-auto w-[95%] mt-20 sm:mt-28 md:mt-32 lg:mt-[180px]">
            <div className="relative z-10">
                {/* Header Section */}
                <div className="mb-5">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary font-jost mb-3 sm:mb-4">
                        {t("myOrder")}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-text-sec font-comme">
                        {t("reviewItemProceed")}
                    </p>
                </div>

                {/* Orders List */}
                <div className="space-y-5 mb-12 sm:mb-16 md:mb-20">
                    {ordersData.map((order) => (
                        <div
                            key={order.id}
                            className="bg-[#FFFFFF80] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-[#F28097] shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
                                {/* Book Image */}
                                <div className="shrink-0 w-full md:w-auto">
                                    <div className="relative w-[185px] mx-auto h-[220px] transform">
                                        <Image
                                            src={order.bookImage}
                                            alt={order.bookTitle}
                                            fill
                                            className="object-cover rounded-lg shadow-md"
                                        />
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        {/* Book Title */}
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary font-jost">
                                            {order.bookTitle}
                                        </h3>

                                        {/* Book Details */}
                                        <div className="text-sm sm:text-base text-text-sec font-comme flex gap-3">
                                            <p>{t("name")}: <span className="font-semibold text-text-primary">{order.childName}</span></p>
                                            <p>{t("age")}: <span className="font-semibold text-text-primary">{order.childAge}</span></p>
                                            <p>{t("page")}: <span className="font-semibold text-text-primary">{order.pages}</span></p>
                                            <p>{t("language")}: <span className="font-semibold text-text-primary">{order.language}</span></p>
                                        </div>

                                        {/* Order Information */}
                                        <div className="space-y-3 text-sm sm:text-base text-text-sec font-comme">
                                            <p>{t("orderDate")}: <span className="font-semibold text-text-primary">{order.orderDate}</span></p>
                                            <p>{t("orderId")}: <span className="font-semibold text-text-primary">{order.orderId}</span></p>
                                            <p>{t("status")}: <span className="font-semibold text-text-primary">{order.status}</span></p>
                                        </div>
                                    </div>

                                    {/* Price and Buttons */}
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 sm:mt-0 mt-3">
                                            <span className="text-xl sm:text-2xl font-bold text-text-primary font-jost">
                                                € {order.price.toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            {/* Download Receipt Button */}
                                            <button
                                                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#F28097] text-[#F28097] font-semibold rounded-lg hover:bg-[#F28097] hover:text-white transition-all duration-300 font-comme text-sm sm:text-base font-dynapuff"
                                            >
                                                {t("downloadReceipt")}
                                            </button>

                                            {/* Track Order Button */}
                                            <button
                                                onClick={() => handleTrackOrder(order.orderId)}
                                                className="relative px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
                                            >
                                                <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                                                    <span className="text-white">{t("trackOrder")}</span>
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
                        </div>
                    ))}
                </div>

              
            </div>
        </div>
    );
}

