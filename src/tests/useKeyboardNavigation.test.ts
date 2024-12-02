import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

describe("useKeyboardNavigation", () => {
  // Initialize the mock with proper typing
  const mockOnPageChange = vi.fn() as Mock;

  beforeEach(() => {
    // Clear mock between tests
    mockOnPageChange.mockClear();
  });

  const defaultProps = {
    currentPage: 2,
    totalPages: 5,
    onPageChange: mockOnPageChange,
    isLoading: false,
  };

  const setupHook = (props = defaultProps) => {
    return renderHook(() => useKeyboardNavigation(props));
  };

  const simulateKeyPress = (key: string) => {
    const event = new KeyboardEvent("keydown", { key });
    window.dispatchEvent(event);
  };

  it("navigates to previous page on ArrowLeft press", () => {
    setupHook();
    simulateKeyPress("ArrowLeft");
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("navigates to next page on ArrowRight press", () => {
    setupHook();
    simulateKeyPress("ArrowRight");
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("does not navigate below page 1", () => {
    setupHook({
      ...defaultProps,
      currentPage: 1,
    });
    simulateKeyPress("ArrowLeft");
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("does not navigate beyond total pages", () => {
    setupHook({
      ...defaultProps,
      currentPage: 5,
      totalPages: 5,
    });
    simulateKeyPress("ArrowRight");
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("does not navigate while loading", () => {
    setupHook({
      ...defaultProps,
      isLoading: true,
    });
    simulateKeyPress("ArrowLeft");
    simulateKeyPress("ArrowRight");
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("ignores irrelevant key presses", () => {
    setupHook();
    simulateKeyPress("Enter");
    simulateKeyPress("Space");
    simulateKeyPress("Tab");
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it("removes event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = setupHook();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("updates navigation when current page changes", () => {
    const { rerender } = renderHook((props) => useKeyboardNavigation(props), {
      initialProps: defaultProps,
    });

    // Test initial navigation
    simulateKeyPress("ArrowRight");
    expect(mockOnPageChange).toHaveBeenCalledWith(3);

    // Update current page and test navigation
    rerender({
      ...defaultProps,
      currentPage: 4,
    });

    mockOnPageChange.mockClear();
    simulateKeyPress("ArrowRight");
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it("handles edge cases of total pages", () => {
    setupHook({
      ...defaultProps,
      currentPage: 1,
      totalPages: 1,
    });

    simulateKeyPress("ArrowLeft");
    simulateKeyPress("ArrowRight");
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
