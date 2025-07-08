import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./keyboard-navigation.module.css";

interface KeyboardNavigationProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  returnFocusOnDeactivate?: boolean;
}

interface FocusableElement {
  element: HTMLElement;
  tabIndex: number;
  selector: string;
}

interface KeyboardShortcutProps {
  shortcut: string | string[];
  onTrigger: () => void;
  disabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  description?: string;
  global?: boolean;
}

interface NavigationGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical" | "grid";
  wrap?: boolean;
  onItemFocus?: (index: number, element: HTMLElement) => void;
  onItemSelect?: (index: number, element: HTMLElement) => void;
  defaultIndex?: number;
  columns?: number; // For grid navigation
}

// Utility functions for keyboard navigation
const FOCUSABLE_SELECTORS = [
  'button',
  'input',
  'textarea',
  'select',
  'a[href]',
  '[tabindex]',
  '[contenteditable]',
  'details',
  'summary',
  'iframe',
  'embed',
  'object',
  'area[href]',
  'video[controls]',
  'audio[controls]',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="switch"]',
  '[role="textbox"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="tree"]',
  '[role="grid"]',
  '[role="treegrid"]',
].join(', ');

const getFocusableElements = (container: HTMLElement): FocusableElement[] => {
  const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[];
  
  return elements
    .filter(element => {
      const style = window.getComputedStyle(element);
      return (
        !element.disabled &&
        element.offsetParent !== null &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        element.tabIndex >= 0
      );
    })
    .map(element => ({
      element,
      tabIndex: element.tabIndex,
      selector: element.tagName.toLowerCase(),
    }))
    .sort((a, b) => {
      if (a.tabIndex === b.tabIndex) return 0;
      if (a.tabIndex === 0) return 1;
      if (b.tabIndex === 0) return -1;
      return a.tabIndex - b.tabIndex;
    });
};

const isHotkey = (event: KeyboardEvent, hotkey: string): boolean => {
  const keys = hotkey.toLowerCase().split('+');
  const eventKey = event.key.toLowerCase();
  
  const hasCtrl = keys.includes('ctrl') || keys.includes('control');
  const hasAlt = keys.includes('alt');
  const hasShift = keys.includes('shift');
  const hasMeta = keys.includes('meta') || keys.includes('cmd');
  
  const actualKey = keys.find(key => 
    !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd'].includes(key)
  );
  
  return (
    event.ctrlKey === hasCtrl &&
    event.altKey === hasAlt &&
    event.shiftKey === hasShift &&
    event.metaKey === hasMeta &&
    eventKey === actualKey
  );
};

// Main Keyboard Navigation Component
export const KeyboardNavigation = React.forwardRef<HTMLDivElement, KeyboardNavigationProps>(
  ({ 
    children, 
    className, 
    disabled = false,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    trapFocus = false,
    restoreFocus = false,
    initialFocus = false,
    escapeDeactivates = false,
    clickOutsideDeactivates = false,
    returnFocusOnDeactivate = false,
    ...props 
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);
    const [isActive, setIsActive] = React.useState(false);

    // Store previous focus when component mounts
    React.useEffect(() => {
      if (restoreFocus && document.activeElement) {
        previousFocusRef.current = document.activeElement as HTMLElement;
      }
    }, [restoreFocus]);

    // Set initial focus
    React.useEffect(() => {
      if (initialFocus && containerRef.current) {
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length > 0) {
          focusableElements[0].element.focus();
          setIsActive(true);
        }
      }
    }, [initialFocus]);

    // Handle focus trapping
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      onKeyDown?.(event);

      if (trapFocus && event.key === 'Tab') {
        const focusableElements = getFocusableElements(containerRef.current!);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0].element;
        const lastElement = focusableElements[focusableElements.length - 1].element;

        if (event.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (escapeDeactivates && event.key === 'Escape') {
        setIsActive(false);
        if (returnFocusOnDeactivate && previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        clickOutsideDeactivates &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
        if (returnFocusOnDeactivate && previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };

    // Set up click outside listener
    React.useEffect(() => {
      if (clickOutsideDeactivates) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [clickOutsideDeactivates]);

    const navigationClasses = cn(
      styles.keyboardNavigation,
      trapFocus && styles.trapFocus,
      isActive && styles.active,
      disabled && styles.disabled,
      className
    );

    return (
      <div
        ref={containerRef}
        className={navigationClasses}
        onKeyDown={handleKeyDown}
        onKeyUp={onKeyUp}
        onKeyPress={onKeyPress}
        tabIndex={trapFocus ? -1 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
KeyboardNavigation.displayName = "KeyboardNavigation";

// Keyboard Shortcut Hook
export const useKeyboardShortcut = ({
  shortcut,
  onTrigger,
  disabled = false,
  preventDefault = true,
  stopPropagation = true,
  global = false,
}: KeyboardShortcutProps) => {
  React.useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
      
      if (shortcuts.some(s => isHotkey(event, s))) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        onTrigger();
      }
    };

    const target = global ? document : document.activeElement;
    if (target) {
      target.addEventListener('keydown', handleKeyDown);
      return () => target.removeEventListener('keydown', handleKeyDown);
    }
  }, [shortcut, onTrigger, disabled, preventDefault, stopPropagation, global]);
};

// Navigation Group Component
export const NavigationGroup = React.forwardRef<HTMLDivElement, NavigationGroupProps>(
  ({ 
    children, 
    className, 
    direction = "horizontal",
    wrap = false,
    onItemFocus,
    onItemSelect,
    defaultIndex = 0,
    columns = 1,
    ...props 
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = React.useState(defaultIndex);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const focusableElements = getFocusableElements(containerRef.current!);
      if (focusableElements.length === 0) return;

      let newIndex = currentIndex;
      const maxIndex = focusableElements.length - 1;

      switch (event.key) {
        case 'ArrowRight':
          if (direction === "horizontal" || direction === "grid") {
            event.preventDefault();
            newIndex = currentIndex < maxIndex ? currentIndex + 1 : wrap ? 0 : currentIndex;
          }
          break;

        case 'ArrowLeft':
          if (direction === "horizontal" || direction === "grid") {
            event.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? maxIndex : currentIndex;
          }
          break;

        case 'ArrowDown':
          if (direction === "vertical") {
            event.preventDefault();
            newIndex = currentIndex < maxIndex ? currentIndex + 1 : wrap ? 0 : currentIndex;
          } else if (direction === "grid") {
            event.preventDefault();
            const nextRowIndex = currentIndex + columns;
            newIndex = nextRowIndex <= maxIndex ? nextRowIndex : wrap ? (currentIndex % columns) : currentIndex;
          }
          break;

        case 'ArrowUp':
          if (direction === "vertical") {
            event.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? maxIndex : currentIndex;
          } else if (direction === "grid") {
            event.preventDefault();
            const prevRowIndex = currentIndex - columns;
            newIndex = prevRowIndex >= 0 ? prevRowIndex : wrap ? (Math.floor(maxIndex / columns) * columns + (currentIndex % columns)) : currentIndex;
          }
          break;

        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;

        case 'End':
          event.preventDefault();
          newIndex = maxIndex;
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          onItemSelect?.(currentIndex, focusableElements[currentIndex].element);
          focusableElements[currentIndex].element.click();
          break;
      }

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        focusableElements[newIndex].element.focus();
        onItemFocus?.(newIndex, focusableElements[newIndex].element);
      }
    };

    const handleFocus = (event: React.FocusEvent) => {
      const focusableElements = getFocusableElements(containerRef.current!);
      const focusedIndex = focusableElements.findIndex(
        item => item.element === event.target
      );
      
      if (focusedIndex !== -1) {
        setCurrentIndex(focusedIndex);
        onItemFocus?.(focusedIndex, focusableElements[focusedIndex].element);
      }
    };

    const navigationClasses = cn(
      styles.navigationGroup,
      styles[`direction-${direction}`],
      wrap && styles.wrap,
      className
    );

    return (
      <div
        ref={containerRef}
        className={navigationClasses}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        role={direction === "grid" ? "grid" : "group"}
        style={direction === "grid" ? { '--columns': columns } as React.CSSProperties : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavigationGroup.displayName = "NavigationGroup";

// Roving Tabindex Hook
export const useRovingTabindex = (
  items: React.RefObject<HTMLElement>[],
  defaultIndex: number = 0
) => {
  const [currentIndex, setCurrentIndex] = React.useState(defaultIndex);

  React.useEffect(() => {
    items.forEach((item, index) => {
      if (item.current) {
        item.current.tabIndex = index === currentIndex ? 0 : -1;
      }
    });
  }, [items, currentIndex]);

  const setFocusedIndex = (index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      items[index].current?.focus();
    }
  };

  return {
    currentIndex,
    setFocusedIndex,
    props: {
      onKeyDown: (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            setFocusedIndex(currentIndex < items.length - 1 ? currentIndex + 1 : 0);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            setFocusedIndex(currentIndex > 0 ? currentIndex - 1 : items.length - 1);
            break;
          case 'Home':
            event.preventDefault();
            setFocusedIndex(0);
            break;
          case 'End':
            event.preventDefault();
            setFocusedIndex(items.length - 1);
            break;
        }
      },
      onFocus: (event: React.FocusEvent) => {
        const focusedIndex = items.findIndex(item => item.current === event.target);
        if (focusedIndex !== -1) {
          setCurrentIndex(focusedIndex);
        }
      },
    },
  };
};

// Skip Link Component
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href, children, className, ...props }, ref) => {
    const skipLinkClasses = cn(styles.skipLink, className);

    return (
      <a
        ref={ref}
        href={href}
        className={skipLinkClasses}
        {...props}
      >
        {children}
      </a>
    );
  }
);
SkipLink.displayName = "SkipLink";

// Focus Trap Hook
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = true
) => {
  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0].element;
    const lastElement = focusableElements[focusableElements.length - 1].element;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Focus the first element initially
    firstElement.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
};

// Announce to screen readers
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = styles.screenReaderOnly;
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}; 