import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubUser } from "../types/github";
import { ResultGrid } from "../components/SearchResults/ResultGrid";

describe("ResultGrid Component", () => {
  const mockUsers: GitHubUser[] = [
    {
      id: 1,
      login: "user1",
      avatar_url: "https://example.com/avatar1.jpg",
      html_url: "https://github.com/user1",
    },
    {
      id: 2,
      login: "user2",
      avatar_url: "https://example.com/avatar2.jpg",
      html_url: "https://github.com/user2",
    },
  ];

  const defaultProps = {
    results: [],
    isLoading: false,
    error: "",
  };

  it("shows no results message when there are no results", () => {
    render(<ResultGrid {...defaultProps} />);

    const noResultsMessage = screen.getByTestId("no-results-message");
    expect(noResultsMessage).toBeInTheDocument();
    expect(noResultsMessage).toHaveTextContent("No results found");
  });

  it("renders results grid with correct styling", () => {
    render(<ResultGrid {...defaultProps} results={mockUsers} />);

    const grid = screen.getByTestId("results-grid");
    expect(grid).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "gap-4"
    );
  });

  it("renders correct number of result items", () => {
    render(<ResultGrid {...defaultProps} results={mockUsers} />);

    const resultItems = screen.getAllByTestId(/^result-item-/);
    expect(resultItems).toHaveLength(2);
  });

  it("renders each result with correct content", () => {
    render(<ResultGrid {...defaultProps} results={mockUsers} />);

    mockUsers.forEach((user, index) => {
      const resultContent = screen.getByTestId(`result-item-${index}`);
      expect(resultContent).toHaveTextContent(user.login);
    });
  });

  it("does not show no results message when loading", () => {
    render(<ResultGrid {...defaultProps} isLoading={true} />);

    expect(screen.queryByTestId("no-results-message")).not.toBeInTheDocument();
  });

  it("does not show no results message when there is an error", () => {
    render(<ResultGrid {...defaultProps} error="Some error" />);

    expect(screen.queryByTestId("no-results-message")).not.toBeInTheDocument();
  });

  it("renders all result items with correct indices", () => {
    const { rerender } = render(
      <ResultGrid {...defaultProps} results={mockUsers} />
    );

    expect(screen.getAllByTestId(/^result-item-/)).toHaveLength(2);

    // Test with more results
    const moreUsers = [
      ...mockUsers,
      {
        id: 3,
        login: "user3",
        avatar_url: "https://example.com/avatar3.jpg",
        html_url: "https://github.com/user3",
        type: "User",
        url: "https://api.github.com/users/user3",
        node_id: "node3",
      },
    ];

    rerender(<ResultGrid {...defaultProps} results={moreUsers} />);

    const resultItems = screen.getAllByTestId(/^result-item-/);
    expect(resultItems).toHaveLength(3);

    resultItems.forEach((item, index) => {
      expect(item).toHaveAttribute("data-testid", `result-item-${index}`);
    });
  });
});
