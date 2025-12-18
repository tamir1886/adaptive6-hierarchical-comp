import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default () => {
    return <AppBar position="sticky" color="primary" >
        <Toolbar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Adapative 6
            </Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton aria-label="settings">
                <SettingsOutlinedIcon sx={{ fontSize: 30, color: "#ffffffe0" }} />
            </IconButton>
        </Toolbar>
    </AppBar>
}