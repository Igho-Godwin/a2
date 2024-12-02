import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const useKeyboardNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLoading) return;

      switch (event.key) {
        case "ArrowLeft":
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          }
          break;
        case "ArrowRight":
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, onPageChange, isLoading]);
};
