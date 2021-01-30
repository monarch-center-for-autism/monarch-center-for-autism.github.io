export type File = gapi.client.drive.File;
export type FileList = gapi.client.drive.FileList;

export type Folder = Pick<File, "id" | "name" | "shortcutDetails">;

export type Subcategory = Folder & {
  categoryId: string;
  loading: boolean;
  files: File[];
};

export type Category = Folder & {
  pageId: string;
  loading: boolean;
  files: File[];
};

export type SiteStructure = {
  pages: Folder[];
  categories: Category[];
  subcategories: Subcategory[];
};
