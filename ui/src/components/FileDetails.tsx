import { Box, Typography } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

export default () => {
    return (
        <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minWidth: 0 }}>
            <Box sx={{ textAlign: "center" }}>
                <InsertDriveFileOutlinedIcon sx={{ fontSize: 120, opacity: 0.2 }} />
                <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 600 }}>
                    File details
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.6, maxWidth: 420 }}>
                    Select a file to view its metadata.
                </Typography>
            </Box>
        </Box>
    );
}
