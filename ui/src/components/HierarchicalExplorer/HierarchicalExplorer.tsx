import React, { useCallback, useMemo } from "react";
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography, Skeleton, Button } from "@mui/material";
import { ExplorerRow } from "./ExplorerRow";
import { useHierarchicalState } from "./useHierarchicalState";

export type HierarchicalExplorerProps<T> = {
    items: T[];
    getId: (item: T) => string;
    getLabel: (item: T) => string;
    getSecondary?: (item: T) => string | undefined;
    isBranch: (item: T) => boolean;
    renderIcon?: (item: T) => React.ReactNode;
    loadChildren?: (item: T) => Promise<T[]>;
};

function LoadingRows({ paddingLeft }: { paddingLeft: number }) {
    return (
        <List component="div" disablePadding>
            {Array.from({ length: 3 }).map((_, i) => (
                <ListItemButton key={i} sx={{ pl: paddingLeft }} disabled>
                    <ListItemIcon>
                        <Skeleton variant="circular" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary={<Skeleton width="60%" />} secondary={<Skeleton width="30%" />} />
                </ListItemButton>
            ))}
        </List>
    );
}

function ErrorRow({ paddingLeft, message, onRetry, }: { paddingLeft: number; message: string; onRetry: () => void; }) {
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

export function HierarchicalExplorer<T>({ items, getId, getLabel, getSecondary, isBranch, renderIcon, loadChildren }: HierarchicalExplorerProps<T>) {

    const { state, toggleExpanded, retry } = useHierarchicalState(getId, loadChildren);
    const getIndent = useCallback((level: number) => 2 + level * 2, []);
    const renderLevel = useCallback((levelItems: T[], level: number): React.ReactNode => {
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

                    return (
                        <Box key={id}>
                            <ExplorerRow label={getLabel(item)} secondary={getSecondary?.(item)} icon={renderIcon?.(item)} isBranch={branch} isOpen={open} indent={rowIndent} onClick={() => { if (!branch) return; toggleExpanded(item) }} />
                            {branch && (
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    {loading ? (
                                        <LoadingRows paddingLeft={childIndent} />
                                    ) : error ? (
                                        <ErrorRow
                                            paddingLeft={childIndent}
                                            message={error}
                                            onRetry={() => retry(item)}
                                        />
                                    ) : (
                                        renderLevel(children, level + 1)
                                    )}
                                </Collapse>
                            )}
                        </Box>
                    );
                })}
            </List>
        );
    },
        [getId, getIndent, getLabel, getSecondary, isBranch, renderIcon, retry, state, toggleExpanded]
    );

    const tree = useMemo(() => renderLevel(items, 0), [items, renderLevel]);

    return <Box>{tree}</Box>;
}
