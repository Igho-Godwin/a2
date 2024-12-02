import React from "react";
import { GitHubUser } from "../../types/github";

interface ResultCardProps {
  result: GitHubUser;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  return (
    <article
      className="p-4 border rounded-lg hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
      tabIndex={0}
      data-testid="result-card"
    >
      <div className="flex items-center gap-4">
        <img
          src={result.avatar_url}
          alt={`${result.login}'s profile`}
          className="w-16 h-16 rounded-full"
          loading="lazy"
          data-testid="user-avatar"
        />
        <div>
          <h2
            className="font-semibold break-all"
            id={`result-${index}-heading`}
            data-testid="username-heading"
          >
            {result.login}
          </h2>
          <a
            href={result.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-1 inline-block focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-labelledby={`result-${index}-heading`}
            data-testid="profile-link"
          >
            View Profile
            <span className="sr-only" data-testid="new-tab-text">
              Opens in a new tab
            </span>
          </a>
        </div>
      </div>
    </article>
  );
};
