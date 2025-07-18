import { RefObject } from 'react';

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Width of dropdown (w-60 = 15rem = 240px)

    // Calculate the initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // Check if the dropdown will overflow on the right side
    if (left + dropdownWidth > window.innerWidth) {
      // Move the dropdown to the left
      left = rect.right + window.scrollX - dropdownWidth;

      // If still off-screen, align to the right edge of viewport with some padding
      if (left < 0) {
        // Move the dropdown to the right
        left = window.innerWidth - dropdownWidth - 16;
      }
    }

    // Ensure dropdown doesn't go off left edge
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
}