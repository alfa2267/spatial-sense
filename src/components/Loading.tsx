import React, { useEffect, useState, useRef } from 'react';
import './Loading.css';

// Extend the Window interface for global loading indicator
declare global {
  interface Window {
    loadingIndicator?: {
      show: (message?: string) => void;
      hide: () => void;
      forceHide: () => void;
    };
  }
}

interface LoadingProps {
  message?: string;
  spinner?: boolean;
  overlay?: boolean;
  show?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  spinner = true,
  overlay = true,
  show = false,
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isMounted, setIsMounted] = useState(show);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Handle show/hide with transitions
  useEffect(() => {
    if (show) {
      setIsMounted(true);
      // Small timeout to allow CSS transition to work
      const timer = setTimeout(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = '';
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      ref={loadingRef}
      className={`loading-component d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 ${
        overlay ? 'loading-overlay' : ''
      }`}
      style={{
        zIndex: 1080,
        display: isVisible ? 'flex' : 'none',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      }}
    >
      <div className="text-center">
        {spinner && (
          <div 
            className="spinner-border text-primary" 
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {message && (
          <div className="mt-3 h5">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for using loading state
interface UseLoadingOptions {
  initialShow?: boolean;
  message?: string;
  spinner?: boolean;
  overlay?: boolean;
}

export const useLoading = ({
  initialShow = false,
  message = 'Loading...',
  spinner = true,
  overlay = true,
}: UseLoadingOptions = {}) => {
  const [isLoading, setIsLoading] = useState(initialShow);
  const [loadingMessage, setLoadingMessage] = useState(message);

  const show = (message?: string) => {
    if (message) setLoadingMessage(message);
    setIsLoading(true);
  };

  const hide = () => {
    setIsLoading(false);
  };

  const LoadingComponent: React.FC = () => (
    <Loading
      show={isLoading}
      message={loadingMessage}
      spinner={spinner}
      overlay={overlay}
    />
  );

  return {
    isLoading,
    show,
    hide,
    setMessage: setLoadingMessage,
    Loading: LoadingComponent,
  };
};

// Default export with global instance functionality
const defaultLoading = {
  show: (message?: string) => {
    if (window.loadingIndicator) {
      window.loadingIndicator.show(message);
    }
  },
  hide: () => {
    if (window.loadingIndicator) {
      window.loadingIndicator.hide();
    }
  },
};

export default defaultLoading;
