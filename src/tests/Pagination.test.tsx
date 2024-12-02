import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "../components/Pagination/Pagination";

describe("Pagination Component", () => {
  const setupPagination = ({
    currentPage = 1,
    totalPages = 10,
    totalResults = 100,
    resultsPerPage = 10,
    isLoading = false,
    onPageChange = vi.fn(),
  } = {}) => {
    return render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    );
  };

  it("should not render when there is only one page", () => {
    setupPagination({ totalPages: 1 });
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("should display correct results summary", () => {
    setupPagination({
      currentPage: 2,
      totalResults: 100,
      resultsPerPage: 10,
    });
    const summary = screen.getByTestId("pagination-summary");
    expect(summary).toHaveTextContent("Showing results 11 to 20 of 100");
  });

  it("should handle page changes correctly", () => {
    const onPageChange = vi.fn();
    setupPagination({ currentPage: 5, onPageChange });

    fireEvent.click(screen.getByTestId("pagination-next"));
    expect(onPageChange).toHaveBeenCalledWith(6);

    fireEvent.click(screen.getByTestId("pagination-prev"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("should disable previous button on first page", () => {
    setupPagination({ currentPage: 1 });
    const prevButton = screen.getByTestId("pagination-prev");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    setupPagination({ currentPage: 10, totalPages: 10 });
    const nextButton = screen.getByTestId("pagination-next");
    expect(nextButton).toBeDisabled();
  });

  it("should handle loading state correctly", () => {
    setupPagination({ isLoading: true });
    expect(screen.getByTestId("pagination-loading")).toBeInTheDocument();

    // Check if all page buttons are disabled
    const pagesContainer = screen.getByTestId("pagination-pages");
    const buttons = pagesContainer.querySelectorAll("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("should display correct page numbers for small number of pages", () => {
    setupPagination({ totalPages: 5 });
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`pagination-page-${i}`)).toBeInTheDocument();
    }
  });

  it("should display ellipsis for large number of pages", () => {
    setupPagination({ currentPage: 5, totalPages: 20 });
    const ellipses = screen.getAllByTestId("pagination-ellipsis");
    expect(ellipses).toHaveLength(2);
  });

  it("should highlight current page", () => {
    const currentPage = 5;
    setupPagination({ currentPage });
    const currentPageButton = screen.getByTestId(
      `pagination-page-${currentPage}`
    );
    expect(currentPageButton).toHaveClass("bg-blue-600");
  });

  it("should render first and last page numbers for large number of pages", () => {
    const totalPages = 20;
    setupPagination({ currentPage: 10, totalPages });

    expect(screen.getByTestId("pagination-page-1")).toBeInTheDocument();
    expect(
      screen.getByTestId(`pagination-page-${totalPages}`)
    ).toBeInTheDocument();
  });

  it("should show appropriate range of pages around current page", () => {
    setupPagination({ currentPage: 5, totalPages: 10 });

    // Check for pages 4, 5, and 6
    expect(screen.getByTestId("pagination-page-4")).toBeInTheDocument();
    expect(screen.getByTestId("pagination-page-5")).toBeInTheDocument();
    expect(screen.getByTestId("pagination-page-6")).toBeInTheDocument();
  });
});
