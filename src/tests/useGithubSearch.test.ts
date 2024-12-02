import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { searchGitHub } from "../services/githubApi";
import { GitHubUser } from "../types/github";
import { useGitHubSearch } from "../hooks/useGithubSearch";

// Mock the API module
vi.mock("../services/githubApi", () => ({
  searchGitHub: vi.fn(),
}));

describe("useGitHubSearch", () => {
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

  const mockPagination = {
    total_count: 100,
    current_page: 1,
    total_pages: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the scrollIntoView function
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useGitHubSearch());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.searchType).toBe("users");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.pagination).toBe(null);
  });

  it("updates search term", () => {
    const { result } = renderHook(() => useGitHubSearch());

    act(() => {
      result.current.setSearchTerm("test");
    });

    expect(result.current.searchTerm).toBe("test");
  });

  it("updates search type", () => {
    const { result } = renderHook(() => useGitHubSearch());

    act(() => {
      result.current.setSearchType("organizations");
    });

    expect(result.current.searchType).toBe("organizations");
  });

  it("handles successful search", async () => {
    const mockSearchGitHub = searchGitHub as Mock;
    mockSearchGitHub.mockResolvedValueOnce({
      data: { items: mockUsers },
      pagination: mockPagination,
    });

    const { result } = renderHook(() => useGitHubSearch());

    // Set search term
    act(() => {
      result.current.setSearchTerm("test");
    });

    // Perform search
    await act(async () => {
      await result.current.handleSearch({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(mockSearchGitHub).toHaveBeenCalledWith("test", "users", 1);
    expect(result.current.results).toEqual(mockUsers);
    expect(result.current.pagination).toEqual(mockPagination);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("");
  });

  it('should update URL after search', async () => {
    const { result } = renderHook(() => useGitHubSearch());
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    act(() => {
      result.current.setSearchTerm('testuser');
    });

    await act(async () => {
      await result.current.handleSearch({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      {},
      '',
      `${window.location.origin}/search/testuser`
    );
  });

  it("handles search error", async () => {
    const mockError = new Error("API Error");
    const mockSearchGitHub = searchGitHub as Mock;
    mockSearchGitHub.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGitHubSearch());

    act(() => {
      result.current.setSearchTerm("test");
    });

    await act(async () => {
      await result.current.handleSearch({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(result.current.error).toBe("API Error");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles page change", async () => {
    const mockSearchGitHub = searchGitHub as Mock;
    mockSearchGitHub.mockResolvedValueOnce({
      data: { items: mockUsers },
      pagination: { ...mockPagination, current_page: 2 },
    });

    const { result } = renderHook(() => useGitHubSearch());

    // Set up search term
    act(() => {
      result.current.setSearchTerm("test");
    });

    // Change page
    await act(async () => {
      await result.current.handlePageChange(2);
    });

    expect(mockSearchGitHub).toHaveBeenCalledWith("test", "users", 2);
  });

  it("does not perform search with empty search term", async () => {
    const mockSearchGitHub = searchGitHub as Mock;
    const { result } = renderHook(() => useGitHubSearch());

    await act(async () => {
      await result.current.handleSearch({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(mockSearchGitHub).not.toHaveBeenCalled();
  });
});
