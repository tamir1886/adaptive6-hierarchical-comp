import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArchiveIcon from "@mui/icons-material/Archive";
import CodeIcon from "@mui/icons-material/Code";
import type { FsItem } from "../mocks/types";
import CircledIcon from "../components/CircledIcon";

export default function getIcon(item: FsItem) {
  if (item.type === "folder") {
    return (
      <CircledIcon color="#F4B400">
        <FolderIcon  />
      </CircledIcon>
    );
  }

  switch (item.kind) {
    case "png":
      return (
        <CircledIcon color="#34A853">
          <ImageIcon  />
        </CircledIcon>
      );

    case "mp4":
      return (
        <CircledIcon color="#EA4335">
          <MovieIcon />
        </CircledIcon>
      );

    case "mp3":
      return (
        <CircledIcon color="#8E24AA">
          <MusicNoteIcon  />
        </CircledIcon>
      );

    case "zip":
      return (
        <CircledIcon color="#6D6D6D">
          <ArchiveIcon  />
        </CircledIcon>
      );

    case "tsx":
    case "json":
      return (
        <CircledIcon color="#1E88E5">
          <CodeIcon />
        </CircledIcon>
      );

    case "pdf":
      return (
        <CircledIcon color="#D32F2F">
          <DescriptionIcon  />
        </CircledIcon>
      );

    case "doc":
      return (
        <CircledIcon color="#1976D2">
          <DescriptionIcon  />
        </CircledIcon>
      );

    case "txt":
    default:
      return (
        <CircledIcon color="#757575">
          <DescriptionIcon  />
        </CircledIcon>
      );
  }
}
