import React, { useId } from "react";
import { Users, Building2 } from "lucide-react";
import { SearchType } from "../../types/github";

interface SearchTypeSelectorProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}

export const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({
  searchType,
  setSearchType,
}) => {
  const groupId = useId();
  const usersId = useId();
  const orgsId = useId();

  const handleKeyDown = (e: React.KeyboardEvent, value: SearchType) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setSearchType(value);
    }
  };

  return (
    <div
      className="flex gap-4"
      role="radiogroup"
      aria-label="Search type selector"
      aria-describedby={`${groupId}-description`}
      data-testid="search-type-selector"
    >
      <span id={`${groupId}-description`} className="sr-only">
        Select whether to search for GitHub users or organizations
      </span>

      <div className="flex items-center gap-2" data-testid="users-option">
        <input
          type="radio"
          id={usersId}
          name="searchType"
          value="users"
          checked={searchType === "users"}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          className="w-4 h-4 text-blue-600"
          aria-checked={searchType === "users"}
          data-testid="users-radio"
        />
        <label
          htmlFor={usersId}
          className="flex items-center gap-2 cursor-pointer"
          tabIndex={searchType !== "users" ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, "users")}
          data-testid="users-label"
        >
          <Users
            size={20}
            aria-hidden="true"
            className="text-gray-700"
            data-testid="users-icon"
          />
          <span>Users</span>
        </label>
      </div>

      <div
        className="flex items-center gap-2"
        data-testid="organizations-option"
      >
        <input
          type="radio"
          id={orgsId}
          name="searchType"
          value="organizations"
          checked={searchType === "organizations"}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          className="w-4 h-4 text-blue-600"
          aria-checked={searchType === "organizations"}
          data-testid="organizations-radio"
        />
        <label
          htmlFor={orgsId}
          className="flex items-center gap-2 cursor-pointer"
          tabIndex={searchType !== "organizations" ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, "organizations")}
          data-testid="organizations-label"
        >
          <Building2
            size={20}
            aria-hidden="true"
            className="text-gray-700"
            data-testid="organizations-icon"
          />
          <span>Organizations</span>
        </label>
      </div>
    </div>
  );
};

