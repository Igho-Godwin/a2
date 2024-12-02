import React, { useId } from "react";
import { Search, Loader2 } from "lucide-react";
import { SearchTypeSelector } from "./SearchTypeSelector";
import { SearchType } from "../../types/github";

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  isLoading,
  onSubmit,
}) => {
  const searchInputId = useId();
  const searchDescriptionId = useId();
  const searchButtonId = useId();

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8"
      role="search"
      aria-label="Search GitHub users and organizations"
      data-testid="search-form"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <input
                type="search"
                id={searchInputId}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter username or organization name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby={searchDescriptionId}
                aria-required="true"
                aria-invalid={searchTerm.length === 0}
                aria-label="Search term"
                data-testid="search-input"
              />
              <span id={searchDescriptionId} className="sr-only">
                Enter a GitHub username or organization name to search
              </span>
            </div>
          </div>
          <button
            type="submit"
            id={searchButtonId}
            disabled={isLoading || !searchTerm.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label={isLoading ? "Searching..." : "Search"}
            aria-busy={isLoading}
            data-testid="search-button"
          >
            {isLoading ? (
              <Loader2
                className="animate-spin"
                size={20}
                aria-hidden="true"
                data-testid="loading-icon"
              />
            ) : (
              <Search size={20} aria-hidden="true" data-testid="search-icon" />
            )}
            <span data-testid="button-text">
              {isLoading ? "Searching..." : "Search"}
            </span>
          </button>
        </div>

        <SearchTypeSelector
          searchType={searchType}
          setSearchType={setSearchType}
        />
      </div>
    </form>
  );
};
