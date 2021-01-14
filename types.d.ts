declare module "*.png";

export type File = gapi.client.drive.File;

export type Folder = Pick<File, "id" | "name" | "shortcutDetails">;

export type QueueFolder = Pick<File, "id" | "shortcutDetails"> & {
  nextPageToken?: string;
};

export type Category = Folder & {
  pageId: string;
  loading: boolean;
  folders: QueueFolder[];
  files: File[];
};

export type Paged<T> = {
  nextPageToken?: string;
  files: T[];
};
