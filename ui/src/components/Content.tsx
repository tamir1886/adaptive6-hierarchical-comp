import React from "react";
import {
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

import getIcon from "./getIcon";
import FileDetails from "./FileDetails";
import { HierarchicalExplorer } from "./HierarchicalExplorer/HierarchicalExplorer";
import { useCreateServer } from "../mocks/useCreateServer";
import { useGetRootItems } from "../mocks/useGetRootItems";
import type { FsItem } from "../mocks/types";
import { formatBytes } from "../mocks/formatBytes";


const sidebarPaperSx = {
  width: "40vw",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};


const Loading = React.memo(() => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        height: "90%",
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="h5" color="text.secondary">
        Loading files...
      </Typography>
    </Box>
  );
});


type ErrorMsgProps = {
  error: string;
};

const ErrorMsg = React.memo(({ error }: ErrorMsgProps) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ color: "error.main", mb: 1 }}>
        An error occurred while fetching data: {error}
      </Typography>
      <Button size="small" variant="outlined">
        Retry
      </Button>
    </Box>
  );
});


const Title = React.memo(() => {
  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        File Explorer
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Async loading per folder
      </Typography>
    </Box>
  );
});


type RootExplorerProps = {
  server: ReturnType<typeof useCreateServer>;
  data: FsItem[] | undefined;
  loading: boolean;
  error: string | null;
};

const RootExplorer = React.memo(
  ({ server, data, loading, error }: RootExplorerProps) => {
    if (loading) return <Loading />;
    if (error) return <ErrorMsg error={error} />;

    return (
      <Box sx={{ flex: 1, overflow: "auto", p: 1.5, minHeight: 0 }}>
        <HierarchicalExplorer<FsItem>
          items={data ?? []}
          getId={(item) => item.id}
          getLabel={(item) => item.name}
          getSecondary={(item) =>
            item.type === "file"
              ? formatBytes(item.sizeBytes)
              : undefined
          }
          isBranch={(item) => item.type === "folder"}
          renderIcon={getIcon}
          loadChildren={(folder) => server.fetchChildren(folder.id)}
        />
      </Box>
    );
  }
);


export default function Content() {
  const server = useCreateServer();
  const { data, loading, error } = useGetRootItems(server);

  return (
    <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <Paper elevation={6} sx={sidebarPaperSx}>
        <Title />
        <Divider />
        <RootExplorer
          server={server}
          data={data}
          loading={loading}
          error={error}
        />
      </Paper>

      {/* data will be sent here as well on future  */}
      <FileDetails /> 
    </Box>
  );
}
