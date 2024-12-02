import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchType } from "../types/github";
import { SearchForm } from "../components/SearchForm/SearchForm";

describe("SearchForm Component", () => {
  const defaultProps = {
    searchTerm: "",
    setSearchTerm: vi.fn(),
    searchType: "users" as SearchType,
    setSearchType: vi.fn(),
    isLoading: false,
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form elements correctly", () => {
    render(<SearchForm {...defaultProps} />);

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("updates search term when typing", async () => {
    const user = userEvent.setup();
    render(<SearchForm {...defaultProps} />);

    const input = screen.getByTestId("search-input");
    await user.type(input, "test-user");

    expect(defaultProps.setSearchTerm).toHaveBeenCalledTimes(9); // Once for each character
    expect(defaultProps.setSearchTerm).toHaveBeenLastCalledWith("r");
  });

  it("disables search button when search term is empty", () => {
    render(<SearchForm {...defaultProps} />);

    const searchButton = screen.getByTestId("search-button");
    expect(searchButton).toBeDisabled();
  });

  it("enables search button when search term is not empty", () => {
    render(<SearchForm {...defaultProps} searchTerm="test" />);

    const searchButton = screen.getByTestId("search-button");
    expect(searchButton).toBeEnabled();
  });

  it("shows loading state when isLoading is true", () => {
    render(<SearchForm {...defaultProps} isLoading={true} searchTerm="test" />);

    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
    expect(screen.getByTestId("button-text")).toHaveTextContent("Searching...");
    expect(screen.getByTestId("search-button")).toHaveAttribute(
      "aria-busy",
      "true"
    );
  });

  it("calls onSubmit when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchForm {...defaultProps} searchTerm="test" />);

    //const form = screen.getByTestId("search-form");
    await user.type(screen.getByTestId("search-input"), "{enter}");

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("prevents form submission when search term is empty", async () => {
    const user = userEvent.setup();
    render(<SearchForm {...defaultProps} />);

    const searchButton = screen.getByTestId("search-button");
    await user.click(searchButton);

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("toggles between search and loading icons based on loading state", () => {
    const { rerender } = render(<SearchForm {...defaultProps} />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();

    rerender(<SearchForm {...defaultProps} isLoading={true} />);
    expect(screen.queryByTestId("search-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
  });

  it("has correct initial button text", () => {
    render(<SearchForm {...defaultProps} />);
    expect(screen.getByTestId("button-text")).toHaveTextContent("Search");
  });

  it("updates button text when loading", () => {
    render(<SearchForm {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("button-text")).toHaveTextContent("Searching...");
  });
});
