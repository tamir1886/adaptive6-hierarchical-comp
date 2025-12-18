import { useCallback, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import type { FsItem } from "./mocks/types";
import { formatBytes } from "./mocks/formatBytes";
import { useCreateServer } from "./mocks/useCreateServer";
import { useGetRootItems } from "./mocks/useGetRootItems";
import { HierarchicalExplorer } from "./components/HierarchicalExplorer";
import getIcon from "./components/getIcon";

function Loading() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, p: 3 }}>
      <CircularProgress size={20} />
      <Typography color="text.secondary">Loading files...</Typography>
    </Box>
  );
}

function ErrorMsg({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ color: "error.main", mb: 1 }}>
        An error occurred while fetching data: {error}
      </Typography>
      <Button size="small" variant="outlined" onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
}

function RootExplorer({ onRetry }: { onRetry: () => void }) {
  const server = useCreateServer();
  const { data, loading, error } = useGetRootItems(server);

  if (loading) return <Loading />;
  if (error) return <ErrorMsg error={error} onRetry={onRetry} />;

  return (
    <HierarchicalExplorer<FsItem>
      items={data ?? []}
      getId={(x) => x.id}
      getLabel={(x) => x.name}
      getSecondary={(x) => (x.type === "file" ? formatBytes(x.sizeBytes) : undefined)}
      isBranch={(x) => x.type === "folder"}
      renderIcon={getIcon}
      loadChildren={(folder) => server.fetchChildren(folder.id)}
    />
  );
}

function RightEmptyState() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        // רקע עדין “מסך ריק”
        background:
          "radial-gradient(1200px 600px at 30% 20%, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0) 55%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 40%)",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 120, opacity: 0.18 }} />
        <Typography variant="h6" sx={{ mt: 1, opacity: 0.72, fontWeight: 600 }}>
          File details
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.6, maxWidth: 420 }}>
          Select a file on the left to view its metadata here.
        </Typography>
      </Box>
    </Box>
  );
}

export default function App() {
  const [reloadKey, setReloadKey] = useState(0);

  const retryRoot = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar  position="sticky" color="primary" >
        <Toolbar  >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Adapative 6
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton  aria-label="settings">
            <SettingsOutlinedIcon sx={{ fontSize: 30,  color: "#ffffffe0"}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          minHeight: 0,      // 🔴 קריטי לגלילה פנימית
          overflow: "hidden" // אין גלילה ברמת המסך
        }}
      >
        {/* LEFT: Explorer */}
        <Paper
          elevation={0}
          sx={{
            width: "40vw",
            minWidth: 360,
            height: "100%",
            borderRadius: 0,
            boxShadow: "3px 0 15px #888888",
            display: "flex",
            flexDirection: "column",
            
          }}
        >
          {/* Explorer header */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              File Explorer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Async loading per folder
            </Typography>
          </Box>

          <Divider />

          {/* Explorer scroll area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto", // ✅ הגלילה כאן בלבד
              p: 1.5,
              minHeight: 0,     // 🔴 חובה
            }}
          >
            <RootExplorer key={reloadKey} onRetry={retryRoot} />
          </Box>
        </Paper>

        {/* RIGHT: Empty details panel */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <RightEmptyState />
        </Box>
      </Box>
    </Box>
  );
}
