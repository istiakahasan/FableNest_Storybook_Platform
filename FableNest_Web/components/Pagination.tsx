import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PaginationProps {
  /** Total number of items to paginate */
  totalItems: number;
  /** Initial page number (default: 1) */
  initialPage?: number;
  /** Initial items per page (default: 10) */
  initialItemsPerPage?: number;
  /** Available items per page options */
  itemsPerPageOptions?: number[];
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  /** Custom class for the container */
  className?: string;
  /** Whether to show items per page dropdown (default: true) */
  showItemsPerPageSelector?: boolean;
}

export default function Pagination({
  totalItems,
  initialPage = 1,
  initialItemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  className = "",
  showItemsPerPageSelector = true,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure current page is within valid range
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const newPage = totalPages;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [totalPages, currentPage, onPageChange]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
    const newCurrentPage = Math.min(currentPage, newTotalPages);

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(newCurrentPage);

    onItemsPerPageChange?.(newItemsPerPage);
    onPageChange?.(newCurrentPage);
  };

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    if (currentPage <= 4) {
      // Near the beginning (show first 5 pages, then ellipsis, then last page)
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > 6) {
        pages.push("...");
      }
      if (totalPages > 5) {
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 3) {
      // Near the end (show first page, ellipsis, then last 5 pages)
      if (totalPages > 5) {
        pages.push("...");
      }
      for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle (show first, ellipsis, current-1, current, current+1, ellipsis, last)
      pages.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    // Remove duplicates that might occur in edge cases
    return Array.from(new Set(pages));
  };

  if (totalItems === 0) {
    return (
      <div
        className={`flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 ${className}`}>
        <div className="text-sm text-gray-700">No items to display</div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 bg-white border-t border-gray-200 ${className}`}>
      {/* Left side - Showing info */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 sm:mb-0">
        {showItemsPerPageSelector ? (
          <>
            <span className="whitespace-nowrap">Showing</span>

            {/* Items per page dropdown using shadcn */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded hover:bg-[#73B7FF]/20 focus:outline-none focus:ring-2 focus:ring-[#0556AB] focus:border-[#0556AB] data-[state=open]:bg-[#73B7FF]/20"
                  aria-label="Items per page">
                  <span>{itemsPerPage}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {itemsPerPageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleItemsPerPageChange(option)}
                    className={`cursor-pointer ${
                      itemsPerPage === option
                        ? "bg-[#73B7FF]/20 text-[#0556AB] focus:bg-[#73B7FF]/20 focus:text-[#0556AB]"
                        : ""
                    }`}>
                    {option} per page
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="whitespace-nowrap">
              {startItem.toLocaleString()} - {endItem.toLocaleString()} of{" "}
              {totalItems.toLocaleString()}
            </span>
          </>
        ) : (
          <span className="whitespace-nowrap">
            Showing {startItem.toLocaleString()} - {endItem.toLocaleString()} of{" "}
            {totalItems.toLocaleString()}
          </span>
        )}
      </div>

      {/* Right side - Pagination */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-[#73B7FF]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0556AB] focus:border-[#0556AB]"
          aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers - Responsive display */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span
                  className="px-1 sm:px-2 text-gray-500 select-none"
                  aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`min-w-8 sm:min-w-9 h-8 sm:h-9 px-2 sm:px-3 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#0556AB] focus:border-[#0556AB] ${
                    currentPage === page
                      ? "bg-[#0556AB] text-white hover:bg-[#0556AB]/90"
                      : "text-gray-700 hover:bg-[#73B7FF]/20 border border-transparent hover:border-[#73B7FF]/50"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}>
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-[#73B7FF]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0556AB] focus:border-[#0556AB]"
          aria-label="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
