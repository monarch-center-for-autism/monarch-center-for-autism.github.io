export type File = gapi.client.drive.File;
export type FileList = gapi.client.drive.FileList;

export type Folder = Pick<File, "id" | "name" | "shortcutDetails">;

export type QueueFolder = Pick<File, "id" | "shortcutDetails"> & {
  nextPageToken?: string;
};

export type Subcategory = Folder & {
  categoryId: string;
  loading: boolean;
  queue: QueueFolder[];
  files: File[];
};

export type Category = Folder & {
  pageId: string;
  loading: boolean;
  queue: QueueFolder[];
  files: File[];
};
