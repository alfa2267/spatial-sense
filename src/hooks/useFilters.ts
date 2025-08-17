import { useState, useMemo, useCallback } from 'react';

interface FilterConfig<T> {
  searchFields?: (keyof T)[];
  sortOptions?: {
    [key: string]: (a: T, b: T) => number;
  };
  filterFunctions?: {
    [key: string]: (item: T, filterValue: string) => boolean;
  };
}

interface UseFiltersOptions {
  initialSearchTerm?: string;
  initialSortBy?: string;
  initialFilters?: Record<string, string>;
}

interface UseFiltersReturn<T> {
  // State
  searchTerm: string;
  sortBy: string;
  filters: Record<string, string>;
  
  // Setters
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: string) => void;
  setFilter: (key: string, value: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  clearFilters: () => void;
  
  // Computed
  filteredData: T[];
  resultCount: number;
}

export const useFilters = <T>(
  data: T[],
  config: FilterConfig<T>,
  options: UseFiltersOptions = {}
): UseFiltersReturn<T> => {
  const [searchTerm, setSearchTerm] = useState(options.initialSearchTerm ?? '');
  const [sortBy, setSortBy] = useState(options.initialSortBy ?? '');
  const [filters, setFiltersState] = useState<Record<string, string>>(
    options.initialFilters ?? {}
  );

  const setFilter = useCallback((key: string, value: string) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  }, []);

  const setFilters = useCallback((newFilters: Record<string, string>) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSortBy('');
    setFiltersState({});
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm && config.searchFields) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        config.searchFields!.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply custom filters
    if (config.filterFunctions) {
      Object.entries(filters).forEach(([filterKey, filterValue]) => {
        if (filterValue && filterValue !== 'all' && config.filterFunctions![filterKey]) {
          result = result.filter(item =>
            config.filterFunctions![filterKey](item, filterValue)
          );
        }
      });
    }

    // Apply sorting
    if (sortBy && config.sortOptions?.[sortBy]) {
      result.sort(config.sortOptions[sortBy]);
    }

    return result;
  }, [data, searchTerm, sortBy, filters, config]);

  return {
    searchTerm,
    sortBy,
    filters,
    setSearchTerm,
    setSortBy,
    setFilter,
    setFilters,
    clearFilters,
    filteredData,
    resultCount: filteredData.length,
  };
};

export default useFilters;