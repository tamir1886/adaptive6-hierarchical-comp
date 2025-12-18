import { useCallback, useState } from "react";

export type HierarchicalState<T> = {
  expanded: Set<string>;
  loading: Set<string>;
  childrenById: Map<string, T[]>;
  errorById: Map<string, string>;
};

export function useHierarchicalState<T>(
  getId: (item: T) => string,
  loadChildren?: (item: T) => Promise<T[]>
) {
  const [state, setState] = useState<HierarchicalState<T>>(() => ({
    expanded: new Set(),
    loading: new Set(),
    childrenById: new Map(),
    errorById: new Map(),
  }));

  const startLoading = useCallback((id: string) => {
    setState((prev) => {
      const loading = new Set(prev.loading);
      loading.add(id);

      const errorById = new Map(prev.errorById);
      errorById.delete(id);

      return { ...prev, loading, errorById };
    });
  }, []);

  const finishSuccess = useCallback((id: string, children: T[]) => {
    setState((prev) => {
      const loading = new Set(prev.loading);
      loading.delete(id);

      const childrenById = new Map(prev.childrenById);
      childrenById.set(id, children);

      return { ...prev, loading, childrenById };
    });
  }, []);

  const finishError = useCallback((id: string, message: string) => {
    setState((prev) => {
      const loading = new Set(prev.loading);
      loading.delete(id);

      const errorById = new Map(prev.errorById);
      errorById.set(id, message);

      return { ...prev, loading, errorById };
    });
  }, []);

  const fetchChildren = useCallback(
    async (item: T) => {
      if (!loadChildren) return;

      const id = getId(item);
      startLoading(id);

      try {
        const children = await loadChildren(item);
        finishSuccess(id, children);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load children";
        finishError(id, msg);
      }
    },
    [finishError, finishSuccess, getId, loadChildren, startLoading]
  );

  const toggleExpanded = useCallback(
    (item: T) => {
      const id = getId(item);
      let shouldFetch = false;

      setState((prev) => {
        const expanded = new Set(prev.expanded);
        const isOpen = expanded.has(id);

        if (isOpen) {
          expanded.delete(id);
        } else {
          expanded.add(id);
          shouldFetch =
            !!loadChildren &&
            !prev.childrenById.has(id) &&
            !prev.loading.has(id);
        }

        return { ...prev, expanded };
      });

      if (shouldFetch) void fetchChildren(item);
    },
    [fetchChildren, getId, loadChildren]
  );

  return {
    state,
    toggleExpanded,
    retry: fetchChildren,
  };
}
