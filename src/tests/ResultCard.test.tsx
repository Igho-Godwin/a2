import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubUser } from "../types/github";
import { ResultCard } from "../components/SearchResults/ResultCard";

describe("ResultCard Component", () => {
  const mockUser: GitHubUser = {
    login: "testuser",
    avatar_url: "https://example.com/avatar.jpg",
    html_url: "https://github.com/testuser",
    id: 1,
  };

  const defaultProps = {
    result: mockUser,
    index: 0,
  };

  it("renders all components correctly", () => {
    render(<ResultCard {...defaultProps} />);

    expect(screen.getByTestId("result-card")).toBeInTheDocument();
    expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("username-heading")).toBeInTheDocument();
    expect(screen.getByTestId("profile-link")).toBeInTheDocument();
  });

  it("displays correct user information", () => {
    render(<ResultCard {...defaultProps} />);

    expect(screen.getByTestId("username-heading")).toHaveTextContent(
      "testuser"
    );

    const avatar = screen.getByTestId("user-avatar") as HTMLImageElement;
    expect(avatar.src).toBe("https://example.com/avatar.jpg");
    expect(avatar.alt).toBe("testuser's profile");

    const link = screen.getByTestId("profile-link");
    expect(link).toHaveAttribute("href", "https://github.com/testuser");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has correct accessibility attributes", () => {
    render(<ResultCard {...defaultProps} />);

    const card = screen.getByTestId("result-card");
    expect(card).toHaveAttribute("tabIndex", "0");

    const heading = screen.getByTestId("username-heading");
    const link = screen.getByTestId("profile-link");
    expect(heading).toHaveAttribute("id", "result-0-heading");
    expect(link).toHaveAttribute("aria-labelledby", "result-0-heading");
  });

  it("updates IDs correctly with different indices", () => {
    render(<ResultCard {...defaultProps} index={5} />);

    const heading = screen.getByTestId("username-heading");
    const link = screen.getByTestId("profile-link");
    expect(heading).toHaveAttribute("id", "result-5-heading");
    expect(link).toHaveAttribute("aria-labelledby", "result-5-heading");
  });

  it("handles long usernames with proper styling", () => {
    const longUsernameUser: GitHubUser = {
      ...mockUser,
      login: "very-very-very-very-long-username-that-might-break-layout",
    };

    render(<ResultCard result={longUsernameUser} index={0} />);

    const heading = screen.getByTestId("username-heading");
    expect(heading).toHaveClass("break-all");
    expect(heading).toHaveTextContent(longUsernameUser.login);
  });

  it("includes screen reader text for new tab indication", () => {
    render(<ResultCard {...defaultProps} />);

    const newTabText = screen.getByTestId("new-tab-text");
    expect(newTabText).toHaveClass("sr-only");
    expect(newTabText).toHaveTextContent("Opens in a new tab");
  });

  it("maintains proper styling classes", () => {
    render(<ResultCard {...defaultProps} />);

    const card = screen.getByTestId("result-card");
    expect(card).toHaveClass(
      "p-4",
      "border",
      "rounded-lg",
      "hover:shadow-md",
      "transition-shadow",
      "focus-within:ring-2",
      "focus-within:ring-blue-500"
    );

    const avatar = screen.getByTestId("user-avatar");
    expect(avatar).toHaveClass("w-16", "h-16", "rounded-full");
  });
});
