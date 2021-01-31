export type File = gapi.client.drive.File;
export type FileList = gapi.client.drive.FileList;

export type Folder = Pick<File, "id" | "name" | "shortcutDetails">;

// Should be an enum, Parcel doesn't support it
// export type CategoryStatus = {
//   INIT: 0;
//   LOADING: 1;
//   FETCHED: 2;
// };

export type Subcategory = Folder & {
  categoryId: string;
  state: number;
  files: File[];
};

export type Category = Folder & {
  pageId: string;
  state: number;
  files: File[];
};

export type SiteStructure = {
  pages: Folder[];
  categories: Category[];
  subcategories: Subcategory[];
};
