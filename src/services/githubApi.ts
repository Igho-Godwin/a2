import {
  GitHubSearchResponse,
  SearchType,
  PaginationInfo,
} from "../types/github";

const BASE_URL = "https://api.github.com";
const PER_PAGE = 30; // GitHub's default is 30 items per page

export const searchGitHub = async (
  searchTerm: string,
  searchType: SearchType,
  page: number = 1
): Promise<{ data: GitHubSearchResponse; pagination: PaginationInfo }> => {
  const typeParam = searchType === "organizations" ? "+type:org" : "";
  const response = await fetch(
    `${BASE_URL}/search/users?q=${encodeURIComponent(
      searchTerm
    )}${typeParam}&page=${page}&per_page=${PER_PAGE}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch results");
  }

  const data = await response.json();

  // Calculate total pages from total count
  const max_total = 1000; // max github can give
  const totalPages = Math.floor(max_total / PER_PAGE);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalResults: max_total,
      perPage: PER_PAGE,
    },
  };
};
