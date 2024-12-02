import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitHubUser } from "../types/github";
import { searchGitHub } from "../services/githubApi";

describe("searchGitHub", () => {
  // Mock the global fetch
  const mockFetch = vi.spyOn(global, "fetch");

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  const mockResponse = {
    items: mockUsers,
    total_count: 2,
    incomplete_results: false,
  };

  it("makes correct API call for users search", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await searchGitHub("test", "users", 1);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.github.com/search/users?q=test&page=1&per_page=30",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
  });

  it("makes correct API call for organizations search", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await searchGitHub("test", "organizations", 1);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.github.com/search/users?q=test+type:org&page=1&per_page=30",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
  });

  it("returns correct pagination info", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await searchGitHub("test", "users", 2);

    expect(result.pagination).toEqual({
      currentPage: 2,
      totalPages: 33,
      totalResults: 1000,
      perPage: 30,
    });
  });

  it("handles API errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(searchGitHub("test", "users", 1)).rejects.toThrow(
      "Failed to fetch results"
    );
  });

  it("properly encodes search terms with special characters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await searchGitHub("testuser@example.com", "users", 1);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent("testuser@example.com")),
      expect.any(Object)
    );
  });

  it("uses default page number when not provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await searchGitHub("test", "users");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=1"),
      expect.any(Object)
    );
  });

  it("includes correct headers in the request", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await searchGitHub("test", "users", 1);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
    );
  });
});
