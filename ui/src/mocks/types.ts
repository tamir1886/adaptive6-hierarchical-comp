export type FsFileKind =
  | "doc"
  | "png"
  | "pdf"
  | "mp3"
  | "mp4"
  | "zip"
  | "txt"
  | "tsx"
  | "json";

export type FolderItem = {
  id: string;
  type: "folder";
  name: string;
  hasChildren: true;
};

export type FileItem = {
  id: string;
  type: "file";
  name: string;
  kind: FsFileKind;
  sizeBytes: number;
};

export type FsItem = FolderItem | FileItem;
