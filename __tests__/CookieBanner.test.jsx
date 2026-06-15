import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CookieBanner from '@/components/CookieBanner';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div data-testid="motion-div" {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('CookieBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render initially due to the delay', () => {
    render(<CookieBanner />);
    expect(screen.queryByText(/Cookie Consent/i)).toBeNull();
  });

  it('should render after the delay if no consent is in localStorage', async () => {
    render(<CookieBanner />);
    
    // Fast-forward the 1500ms timeout within act to resolve the state update
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    expect(screen.getByText(/Cookie Consent/i)).toBeTruthy();
  });

  it('should not render if consent is already in localStorage', () => {
    localStorage.setItem('cookie_consent', 'true');
    render(<CookieBanner />);
    
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.queryByText(/Cookie Consent/i)).toBeNull();
  });

  it('should set localStorage and hide when Accept is clicked', async () => {
    render(<CookieBanner />);
    
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    const acceptBtn = screen.getByText('Accept All');
    
    act(() => {
      fireEvent.click(acceptBtn);
    });
    
    expect(localStorage.getItem('cookie_consent')).toBe('true');
    expect(screen.queryByText(/Cookie Consent/i)).toBeNull();
  });
});
