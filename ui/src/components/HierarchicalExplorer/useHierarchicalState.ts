import { useCallback, useState } from "react";

export type HierarchicalState<T> = {
  expanded: Set<string>;
  loading: Set<string>;
  childrenById: Map<string, T[]>;
  errorById: Map<string, string>;
};

const createInitialState = <T,>(): HierarchicalState<T> => ({
  expanded: new Set(),
  loading: new Set(),
  childrenById: new Map(),
  errorById: new Map(),
});

export function useHierarchicalState<T>(
  getId: (item: T) => string,
  loadChildren?: (item: T) => Promise<T[]>
) {
  const [state, setState] = useState<HierarchicalState<T>>(() =>
    createInitialState<T>()
  );

  const markLoading = useCallback((id: string) => {
    setState((prev) => {
      const loading = new Set(prev.loading);
      loading.add(id);

      const errorById = new Map(prev.errorById);
      errorById.delete(id);

      return { ...prev, loading, errorById };
    });
  }, []);

  const markLoaded = useCallback((id: string, children: T[]) => {
    setState((prev) => {
      const loading = new Set(prev.loading);
      loading.delete(id);

      const childrenById = new Map(prev.childrenById);
      childrenById.set(id, children);

      return { ...prev, loading, childrenById };
    });
  }, []);

  const markFailed = useCallback((id: string, message: string) => {
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
      markLoading(id);

      try {
        const children = await loadChildren(item);
        markLoaded(id, children);
      } catch (e) {
        markFailed(id, e instanceof Error ? e.message : "Failed to load children");
      }
    },
    [getId, loadChildren, markFailed, markLoaded, markLoading]
  );

  const toggleExpanded = useCallback(
    (item: T) => {
      const id = getId(item);

      const shouldFetch =
        !!loadChildren &&
        !state.childrenById.has(id) &&
        !state.loading.has(id) &&
        !state.expanded.has(id);

      setState((prev) => {
        const expanded = new Set(prev.expanded);
        expanded.has(id) ? expanded.delete(id) : expanded.add(id);
        return { ...prev, expanded };
      });

      if (shouldFetch) void fetchChildren(item);
    },
    [fetchChildren, getId, loadChildren, state.childrenById, state.expanded, state.loading]
  );

  return {
    state,
    toggleExpanded,
    retry: fetchChildren,
  };
}
