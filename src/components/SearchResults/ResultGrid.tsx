import React from "react";
import { ResultCard } from "./ResultCard";
import { GitHubUser } from "../../types/github";

interface ResultsGridProps {
  results: GitHubUser[];
  error: string;
  isLoading: boolean;
}

export const ResultGrid: React.FC<ResultsGridProps> = ({
  results,
  isLoading,
  error,
}) => {
  if (results.length === 0 && !isLoading && !error) {
    return (
      <p data-testid="no-results-message" className="text-center text-gray-500">
        No results found
      </p>
    );
  }

  return (
    <div
      data-testid="results-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {results.map((result, index) => (
        <div key={result.id} data-testid={`result-item-${index}`}>
          <ResultCard result={result} index={index} />
        </div>
      ))}
    </div>
  );
};
