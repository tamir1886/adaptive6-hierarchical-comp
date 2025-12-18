import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
  Button,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export type HierarchicalExplorerProps<T> = {
  items: T[];

  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSecondary?: (item: T) => string | undefined;

  isBranch: (item: T) => boolean;
  renderIcon?: (item: T) => React.ReactNode;

  /** Async loader for children when a branch is expanded and not loaded yet */
  loadChildren?: (item: T) => Promise<T[]>;
};

type NodeState<T> = {
  expanded: Set<string>;
  loading: Set<string>;
  childrenById: Map<string, T[]>;
  errorById: Map<string, string>;
};

function LoadingRows({ paddingLeft }: { paddingLeft: number }) {
  return (
    <List component="div" disablePadding>
      {Array.from({ length: 3 }).map((_, i) => (
        <ListItemButton key={i} sx={{ pl: paddingLeft }} disabled>
          <ListItemIcon>
            <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton width="60%" />}
            secondary={<Skeleton width="30%" />}
          />
        </ListItemButton>
      ))}
    </List>
  );
}

function ErrorRow({
  paddingLeft,
  message,
  onRetry,
}: {
  paddingLeft: number;
  message: string;
  onRetry: () => void;
}) {
  return (
    <Box sx={{ pl: paddingLeft, py: 0.75 }}>
      <Typography variant="body2" sx={{ color: "error.main", mb: 0.5 }}>
        Failed to load: {message}
      </Typography>
      <Button size="small" variant="outlined" onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
}

export function HierarchicalExplorer<T>(props: HierarchicalExplorerProps<T>) {
  const { items, getId, getLabel, getSecondary, isBranch, renderIcon, loadChildren } = props;

  const [state, setState] = useState<NodeState<T>>(() => ({
    expanded: new Set(),
    loading: new Set(),
    childrenById: new Map(),
    errorById: new Map(),
  }));

  const baseIndent = 2;
  const indentStep = 2;

  const getIndent = useCallback(
    (level: number) => baseIndent + level * indentStep,
    [baseIndent, indentStep]
  );

  const startLoading = useCallback((id: string) => {
    setState((s) => {
      const loading = new Set(s.loading);
      loading.add(id);

      const errorById = new Map(s.errorById);
      errorById.delete(id);

      return { ...s, loading, errorById };
    });
  }, []);

  const finishLoadingSuccess = useCallback((id: string, children: T[]) => {
    setState((s) => {
      const loading = new Set(s.loading);
      loading.delete(id);

      const childrenById = new Map(s.childrenById);
      childrenById.set(id, children);

      return { ...s, loading, childrenById };
    });
  }, []);

  const finishLoadingError = useCallback((id: string, msg: string) => {
    setState((s) => {
      const loading = new Set(s.loading);
      loading.delete(id);

      const errorById = new Map(s.errorById);
      errorById.set(id, msg);

      return { ...s, loading, errorById };
    });
  }, []);

  const fetchChildrenFor = useCallback(
    async (folder: T) => {
      if (!loadChildren) return;

      const id = getId(folder);

      // mark loading immediately (pure setState, no side effects inside)
      startLoading(id);

      try {
        const children = await loadChildren(folder);
        finishLoadingSuccess(id, children);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load children";
        finishLoadingError(id, msg);
      }
    },
    [finishLoadingError, finishLoadingSuccess, getId, loadChildren, startLoading]
  );

  const toggleFolder = useCallback(
    (folder: T) => {
      const id = getId(folder);
      if (!isBranch(folder)) return;

      let shouldLoad = false;

      setState((s) => {
        const wasExpanded = s.expanded.has(id);

        const expanded = new Set(s.expanded);
        if (wasExpanded) expanded.delete(id);
        else expanded.add(id);

        // Decide load only when opening, not loaded yet, not already loading
        shouldLoad =
          !wasExpanded &&
          !s.childrenById.has(id) &&
          !s.loading.has(id) &&
          Boolean(loadChildren);

        return { ...s, expanded };
      });

      // side effect outside setState
      if (shouldLoad) {
        void fetchChildrenFor(folder);
      }
    },
    [fetchChildrenFor, getId, isBranch, loadChildren]
  );

  const retryLoad = useCallback(
    (folder: T) => {
      if (!loadChildren) return;
      void fetchChildrenFor(folder);
    },
    [fetchChildrenFor, loadChildren]
  );

  const renderLevel = useCallback(
    (levelItems: T[], level: number) => {
      const rowIndent = getIndent(level);
      const childIndent = getIndent(level + 1);

      return (
        <List component="div" disablePadding>
          {levelItems.map((item) => {
            const id = getId(item);
            const branch = isBranch(item);

            const open = state.expanded.has(id);
            const loading = state.loading.has(id);
            const children = state.childrenById.get(id) ?? [];
            const error = state.errorById.get(id);

            const label = getLabel(item);
            const secondary = getSecondary?.(item);
            const icon = renderIcon?.(item);

            const handleClick = () => {
              if (!branch) return;
              toggleFolder(item);
            };

            const endAdornment = branch ? (open ? <ExpandLess /> : <ExpandMore />) : null;

            return (
              <React.Fragment key={id}>
                <ListItemButton onClick={handleClick} sx={{ pl: rowIndent }}>
                  <ListItemIcon>{icon}</ListItemIcon>

                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontWeight: 550 }}
                    secondary={secondary}
                  />

                  {endAdornment}
                </ListItemButton>

                {branch && (
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    {loading ? (
                      <LoadingRows paddingLeft={childIndent} />
                    ) : error ? (
                      <ErrorRow
                        paddingLeft={childIndent}
                        message={error}
                        onRetry={() => retryLoad(item)}
                      />
                    ) : (
                      renderLevel(children, level + 1)
                    )}
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      );
    },
    [
      getId,
      getIndent,
      getLabel,
      getSecondary,
      isBranch,
      renderIcon,
      retryLoad,
      state,
      toggleFolder,
    ]
  );

  // optional: memo to avoid recreating root list if items stable
  const root = useMemo(() => renderLevel(items, 0), [items, renderLevel]);

  return <Box>{root}</Box>;
}
