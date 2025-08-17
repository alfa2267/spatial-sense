import { useState, useCallback } from 'react';

interface UsePageStateOptions {
  initialLoading?: boolean;
  initialError?: string | null;
}

interface PageState {
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

interface UsePageStateReturn extends PageState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSubmitting: (submitting: boolean) => void;
  clearError: () => void;
  handleAsyncAction: <T>(
    action: () => Promise<T>,
    options?: {
      showLoading?: boolean;
      showSubmitting?: boolean;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ) => Promise<T | undefined>;
}

export const usePageState = (options: UsePageStateOptions = {}): UsePageStateReturn => {
  const [loading, setLoading] = useState(options.initialLoading ?? false);
  const [error, setError] = useState<string | null>(options.initialError ?? null);
  const [submitting, setSubmitting] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncAction = useCallback(async <T>(
    action: () => Promise<T>,
    actionOptions: {
      showLoading?: boolean;
      showSubmitting?: boolean;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<T | undefined> => {
    const {
      showLoading = false,
      showSubmitting = true,
      onSuccess,
      onError,
    } = actionOptions;

    try {
      clearError();
      
      if (showLoading) setLoading(true);
      if (showSubmitting) setSubmitting(true);

      const result = await action();
      
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error.message);
      
      if (onError) {
        onError(error);
      } else {
        console.error('Page action error:', error);
      }
      
      return undefined;
    } finally {
      if (showLoading) setLoading(false);
      if (showSubmitting) setSubmitting(false);
    }
  }, [clearError]);

  return {
    loading,
    error,
    submitting,
    setLoading,
    setError,
    setSubmitting,
    clearError,
    handleAsyncAction,
  };
};

export default usePageState;