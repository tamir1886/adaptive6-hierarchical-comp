import React, { memo } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

type ExplorerRowProps = {
  label: string;
  secondary?: string;
  icon?: React.ReactNode;
  isBranch: boolean;
  isOpen: boolean;
  selected?: boolean;
  indent: number;
  onClick: () => void;
};

function ExplorerRowComponent({
  label,
  secondary,
  icon,
  isBranch,
  isOpen,
  indent,
  selected = false,
  onClick,
}: ExplorerRowProps) {
  return (
    <ListItemButton onClick={onClick} sx={{ pl: indent }} selected={selected}>
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        secondary={secondary}
        primaryTypographyProps={{ fontWeight: 550 }}
      />

      {isBranch && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </ListItemButton>
  );
}

export const ExplorerRow = memo(ExplorerRowComponent);
