import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import type { FsItem } from "../mocks/types";
import { formatBytes } from "../mocks/formatBytes";

type FileDetailsProps = { item: FsItem | null };

export default function FileDetails({ item }: FileDetailsProps) {
  return item?.type !== "file" ? (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Box sx={{ textAlign: "center" }}>
        <InsertDriveFileOutlinedIcon sx={{ color: "text.secondary", fontSize: 120, opacity: 0.2 }} />
        <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 600 }}>
          File details
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", opacity: 0.6 }}>
          Select a file to view its metadata.
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box sx={{ flex: 1, p: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card elevation={10} sx={{ width: "min(520px, 100%)", bgcolor: "#fff", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}>
            {item.name}
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>Size</TableCell>
                <TableCell>{formatBytes(item.sizeBytes)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell>{item.kind}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Path</TableCell>
                <TableCell sx={{ wordBreak: "break-all" }}>{item.id}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
