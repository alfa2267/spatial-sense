declare global {
  interface Window {
    // Loading component instance for global access
    loadingIndicator?: {
      show: (message?: string) => void;
      hide: () => void;
      forceHide: () => void;
    };
  }
}

// This ensures the file is treated as a module
export {};
