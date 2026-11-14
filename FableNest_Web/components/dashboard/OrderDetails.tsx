// components/PastOrders.tsx
"use client";

import React, { useState } from "react";
import DashboardPageHeaderTitle from "./DashboardPageHeaderTitle";
import { Separator } from "../ui/separator";
import Image from "next/image";
import BookDetailsCard from "./BookDetailsCard";
import { OngoingOrderDataType as OrderDataType } from "@/types/dashboard2Types";

// Main component props
interface OrdersProps {
  orders: OrderDataType[];
  title: string;
  description?: string;
}

const OrderDetails: React.FC<OrdersProps> = ({
  orders,
  title,
  description,
}) => {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const handleOpenAccordion = (orderId: string) => {
    setOpenAccordionId(openAccordionId === orderId ? null : orderId);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <DashboardPageHeaderTitle title={title} sub_title={description} />
        <Separator className="mt-4 sm:mt-6 bg-gray-200" />
      </div>

      {/* Orders List */}
      <div className="space-y-4 sm:space-y-6">
        {orders.map((order, index) => (
          <div
            key={order.id || `${index}`}
            className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 ease-in-out hover:border-gray-400">
            {/* Main content wrapper - NOT clickable */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Image Container - Responsive sizing */}
              <div className="shrink-0 mx-auto sm:mx-0">
                <div className="relative w-[140px] h-[170px] xs:w-[160px] xs:h-[200px] sm:w-[180px] sm:h-[220px] lg:w-[200px] lg:h-60">
                  <Image
                    src={"/images/dashboard/admin-info-pro.jpg"}
                    alt={"Order image"}
                    fill
                    sizes="(max-width: 480px) 140px, (max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
                    className="rounded-2xl object-cover"
                    priority={index < 2}
                    unoptimized
                  />
                </div>
              </div>

              {/* Order Details - Clickable area */}
              {order.books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleOpenAccordion(order.id)}
                  className="flex-1 min-w-0 cursor-pointer">
                  {/* Order Title and Price */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <h2 className="text-lg xs:text-xl lg:text-2xl font-semibold text-gray-900 line-clamp-2 sm:line-clamp-1">
                      {book.title}
                    </h2>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap mt-1 sm:mt-0">
                      $ {book.price}
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Personal Details - Responsive grid */}
                    <div className="grid grid-cols-2 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 xs:gap-3 sm:gap-x-6 sm:gap-y-2 text-sm xs:text-base text-gray-600">
                      <span className="inline-flex items-center gap-1 truncate">
                        <span className="text-gray-500">Name:</span>
                        <strong className="font-semibold text-gray-800 truncate">
                          {book.characterName}
                        </strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="text-gray-500">Age:</span>
                        <strong className="font-semibold text-gray-800">
                          {book.characterAge}
                        </strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="text-gray-500">Pages:</span>
                        <strong className="font-semibold text-gray-800">
                          {book.totalChapters}
                        </strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="text-gray-500">Language:</span>
                        <strong className="font-semibold text-gray-800">
                          {book.language}
                        </strong>
                      </span>
                    </div>

                    {/* Order Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500 mb-1">
                          Order Date
                        </span>
                        <strong className="font-semibold text-gray-800 text-sm sm:text-base">
                          {formatDateTime(order.createdAt)}
                        </strong>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500 mb-1">
                          Order ID
                        </span>
                        <strong className="font-semibold text-gray-800 font-mono text-sm sm:text-base truncate">
                          {order.id}
                        </strong>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500 mb-1">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${
                            order.orderStatus === "COMPLETED"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : order.orderStatus === "PENDING"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : order.orderStatus === "CANCELLED"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Desktop Accordion Indicator - Clickable */}
              <div
                onClick={() => handleOpenAccordion(order.id)}
                className="hidden lg:flex items-center justify-center lg:items-start cursor-pointer">
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openAccordionId === order.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Mobile Accordion Indicator - Clickable */}
            <div
              onClick={() => handleOpenAccordion(order.id)}
              className="flex lg:hidden justify-center mt-4 pt-4 border-t border-gray-200 cursor-pointer">
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  openAccordionId === order.id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Accordion Content */}
            {openAccordionId === order.id && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                {order.books.map((book) => (
                  <BookDetailsCard
                    orderId={order.id}
                    orderStatus={order.orderStatus}
                    key={book.id}
                    book={book}
                    title="Book Details"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
            No orders found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-lg">
            You haven&apos;t placed any orders yet. Start your first order to
            see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
