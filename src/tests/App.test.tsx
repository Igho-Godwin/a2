import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Create mock functions for the hooks
const mockUseGitHubSearch = vi.fn();
const mockUseKeyboardNavigation = vi.fn();

// Mock the custom hooks
vi.mock("../hooks/useGithubSearch", () => ({
  useGitHubSearch: () => mockUseGitHubSearch(),
}));

vi.mock("../hooks/useKeyboardNavigation", () => ({
  useKeyboardNavigation: () => mockUseKeyboardNavigation(),
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays error message when error occurs", () => {
    const errorMessage = "API rate limit exceeded";
    mockUseGitHubSearch.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      searchType: "repositories",
      setSearchType: vi.fn(),
      results: [],
      isLoading: false,
      error: errorMessage,
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalResults: 50,
        perPage: 10,
      },
      handleSearch: vi.fn(),
      handlePageChange: vi.fn(),
    });

    render(<App />);

    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
  });

  it("renders pagination when results are available", () => {
    mockUseGitHubSearch.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      searchType: "repositories",
      setSearchType: vi.fn(),
      results: [],
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 2,
        totalPages: 5,
        totalResults: 50,
        perPage: 10,
      },
      handleSearch: vi.fn(),
      handlePageChange: vi.fn(),
    });

    render(<App />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("maintains accessibility requirements", () => {
    render(<App />);

    const searchResults = screen.getByTestId("search-results");
    expect(searchResults).toHaveAttribute("role", "region");
    expect(searchResults).toHaveAttribute("aria-label", "Search results");

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("aria-label");
  });
});
