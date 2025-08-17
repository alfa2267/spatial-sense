import { useState, useCallback } from 'react';

interface UseSelectionOptions<T> {
  initialSelection?: T | null;
  allowMultiple?: boolean;
}

interface UseSelectionReturn<T> {
  selectedItem: T | null;
  selectedItems: T[];
  isSelected: (item: T) => boolean;
  selectItem: (item: T) => void;
  deselectItem: (item: T) => void;
  toggleSelection: (item: T) => void;
  clearSelection: () => void;
  selectAll: (items: T[]) => void;
  hasSelection: boolean;
  selectionCount: number;
}

export const useSelection = <T>(
  options: UseSelectionOptions<T> = {}
): UseSelectionReturn<T> => {
  const { initialSelection = null, allowMultiple = false } = options;
  
  const [selectedItem, setSelectedItem] = useState<T | null>(initialSelection);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const isSelected = useCallback((item: T): boolean => {
    if (allowMultiple) {
      return selectedItems.includes(item);
    }
    return selectedItem === item;
  }, [selectedItem, selectedItems, allowMultiple]);

  const selectItem = useCallback((item: T) => {
    if (allowMultiple) {
      setSelectedItems(prev => {
        if (prev.includes(item)) return prev;
        return [...prev, item];
      });
    } else {
      setSelectedItem(item);
    }
  }, [allowMultiple]);

  const deselectItem = useCallback((item: T) => {
    if (allowMultiple) {
      setSelectedItems(prev => prev.filter(selected => selected !== item));
    } else {
      if (selectedItem === item) {
        setSelectedItem(null);
      }
    }
  }, [selectedItem, allowMultiple]);

  const toggleSelection = useCallback((item: T) => {
    if (isSelected(item)) {
      deselectItem(item);
    } else {
      selectItem(item);
    }
  }, [isSelected, selectItem, deselectItem]);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    setSelectedItems([]);
  }, []);

  const selectAll = useCallback((items: T[]) => {
    if (allowMultiple) {
      setSelectedItems([...items]);
    } else if (items.length > 0) {
      setSelectedItem(items[0]);
    }
  }, [allowMultiple]);

  const hasSelection = allowMultiple ? selectedItems.length > 0 : selectedItem !== null;
  const selectionCount = allowMultiple ? selectedItems.length : (selectedItem ? 1 : 0);

  return {
    selectedItem,
    selectedItems,
    isSelected,
    selectItem,
    deselectItem,
    toggleSelection,
    clearSelection,
    selectAll,
    hasSelection,
    selectionCount,
  };
};

export default useSelection;