import { Box } from "@mui/material";
import type { ReactNode } from "react";

type CircledIconProps = {
    color: string;
    children: ReactNode;
};

const CircledIcon = ({ color, children }: CircledIconProps) => {
    return (
        <Box
            sx={{
                padding: "10px",
                marginRight:"12px",
                borderRadius: "50%",
                backgroundColor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
            }}
        >
            {children}
        </Box>
    );
};

export default CircledIcon;
