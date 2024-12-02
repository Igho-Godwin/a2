import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  totalResults: number;
  resultsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  totalResults,
  resultsPerPage,
}) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label={`Pagination, current page ${currentPage} of ${totalPages}`}
      className="mt-8"
      data-testid="pagination"
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        data-testid="pagination-sr-summary"
      >
        Showing results {startResult} to {endResult} of {totalResults}
      </div>

      <div
        className="text-sm text-gray-600 text-center mb-4"
        aria-hidden="true"
        data-testid="pagination-summary"
      >
        Showing results {startResult} to {endResult} of {totalResults}
      </div>

      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label={`Go to previous page, page ${currentPage - 1}`}
          data-testid="pagination-prev"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <div
          className="flex items-center space-x-1"
          role="group"
          data-testid="pagination-pages"
        >
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`
                min-w-[40px] h-10 px-4 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                data-testid={`pagination-page-${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                className="px-4 py-2"
                data-testid="pagination-ellipsis"
              >
                {page}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label={`Go to next page, page ${currentPage + 1}`}
          data-testid="pagination-next"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {isLoading && (
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          data-testid="pagination-loading"
        >
          Loading page {currentPage} results
        </div>
      )}
    </nav>
  );
};
