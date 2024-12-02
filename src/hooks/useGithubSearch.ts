import { useState } from "react";
import { searchGitHub } from "../services/githubApi";
import { GitHubUser, SearchType, PaginationInfo } from "../types/github";

interface UseGitHubSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  results: GitHubUser[];
  isLoading: boolean;
  error: string;
  pagination: PaginationInfo | null;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  handlePageChange: (page: number) => Promise<void>;
}

export const useGitHubSearch = (): UseGitHubSearchReturn => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("users");
  const [results, setResults] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const performSearch = async (
    term: string,
    type: SearchType,
    page: number
  ) => {
    if (!term.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const { data, pagination: paginationInfo } = await searchGitHub(
        term,
        type,
        page
      );
      setResults(data.items || []);
      setPagination(paginationInfo);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(searchTerm, searchType, 1);
    updateUrlWithPushState();
  };

  const updateUrlWithPushState = () => {
    const newUrl = `${window.location.origin}/search/${searchTerm}`;
    window.history.pushState({}, "", newUrl);
  };

  const handlePageChange = async (page: number) => {
    if (searchTerm) {
      await performSearch(searchTerm, searchType, page);
      // Scroll to top of results
      document
        .getElementById("search-bar")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    results,
    isLoading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
  };
};
