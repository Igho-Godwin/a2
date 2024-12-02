import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchType } from "../types/github";
import { SearchTypeSelector } from "../components/SearchForm/SearchTypeSelector";

describe("SearchTypeSelector Component", () => {
  const defaultProps = {
    searchType: "users" as SearchType,
    setSearchType: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all components correctly", () => {
    render(<SearchTypeSelector {...defaultProps} />);

    expect(screen.getByTestId("search-type-selector")).toBeInTheDocument();
    expect(screen.getByTestId("users-option")).toBeInTheDocument();
    expect(screen.getByTestId("organizations-option")).toBeInTheDocument();
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
    expect(screen.getByTestId("organizations-icon")).toBeInTheDocument();
  });

  it("shows correct initial state for users selection", () => {
    render(<SearchTypeSelector {...defaultProps} />);

    const usersRadio = screen.getByTestId("users-radio");
    const orgsRadio = screen.getByTestId("organizations-radio");

    expect(usersRadio).toBeChecked();
    expect(orgsRadio).not.toBeChecked();
  });

  it("shows correct state for organizations selection", () => {
    render(<SearchTypeSelector {...defaultProps} searchType="organizations" />);

    const usersRadio = screen.getByTestId("users-radio");
    const orgsRadio = screen.getByTestId("organizations-radio");

    expect(usersRadio).not.toBeChecked();
    expect(orgsRadio).toBeChecked();
  });

  it("calls setSearchType when selection changes", async () => {
    const user = userEvent.setup();
    render(<SearchTypeSelector {...defaultProps} />);

    const orgsRadio = screen.getByTestId("organizations-radio");
    await user.click(orgsRadio);

    expect(defaultProps.setSearchType).toHaveBeenCalledWith("organizations");
  });

  it("handles keyboard interactions for labels", async () => {
    const user = userEvent.setup();
    render(<SearchTypeSelector {...defaultProps} />);

    const orgsLabel = screen.getByTestId("organizations-label");

    // Test Enter key
    orgsLabel.focus();
    await user.keyboard("{Enter}");
    expect(defaultProps.setSearchType).toHaveBeenCalledWith("organizations");

    // Test Space key
    orgsLabel.focus();
    await user.keyboard(" ");
    expect(defaultProps.setSearchType).toHaveBeenCalledWith("organizations");
  });

  it("manages tabIndex correctly based on selection", () => {
    const { rerender } = render(<SearchTypeSelector {...defaultProps} />);

    const usersLabel = screen.getByTestId("users-label");
    const orgsLabel = screen.getByTestId("organizations-label");

    // When users is selected
    expect(usersLabel).toHaveAttribute("tabIndex", "-1");
    expect(orgsLabel).toHaveAttribute("tabIndex", "0");

    // When organizations is selected
    rerender(
      <SearchTypeSelector {...defaultProps} searchType="organizations" />
    );
    expect(usersLabel).toHaveAttribute("tabIndex", "0");
    expect(orgsLabel).toHaveAttribute("tabIndex", "-1");
  });

  it("maintains correct ARIA attributes", () => {
    render(<SearchTypeSelector {...defaultProps} />);

    const container = screen.getByTestId("search-type-selector");
    const usersRadio = screen.getByTestId("users-radio");
    const orgsRadio = screen.getByTestId("organizations-radio");

    expect(container).toHaveAttribute("role", "radiogroup");
    expect(container).toHaveAttribute("aria-label", "Search type selector");
    expect(usersRadio).toHaveAttribute("aria-checked", "true");
    expect(orgsRadio).toHaveAttribute("aria-checked", "false");
  });

  it("verifies icon accessibility", () => {
    render(<SearchTypeSelector {...defaultProps} />);

    const usersIcon = screen.getByTestId("users-icon");
    const orgsIcon = screen.getByTestId("organizations-icon");

    expect(usersIcon).toHaveAttribute("aria-hidden", "true");
    expect(orgsIcon).toHaveAttribute("aria-hidden", "true");
  });
});
