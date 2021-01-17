import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";
import {
  Category,
  File,
  Folder,
  QueueFolder,
  Subcategory,
} from "./types/types";
import { aFlatMap, aMap } from "./utils/aMap";
import * as google from "./utils/google-apis";

type State = {
  user?: gapi.auth2.GoogleUser;
  pages: Folder[];
  categories: Category[];
  subcategories: Subcategory[];
  activeFile?: File;
};

type FetchStructure = {
  pages: Folder[];
  categories: Category[];
  subcategories: Subcategory[];
};
const fetchStructure = createAsyncThunk<FetchStructure, void, {}>(
  "fetchData",
  async () => {
    const pages = await google.getRootFolders();
    const categories: Category[] = await aFlatMap(
      pages,
      async (page) =>
        await aMap(await google.getFolders(page), async (category) => ({
          ...category,
          loading: false,
          folders: [],
          pageId: page.id,
          files: [],
          queue: [{ id: category.id }],
        }))
    );
    const subcategories: Subcategory[] = await aFlatMap(
      categories,
      async (category) =>
        await aMap(await google.getFolders(category), (subcategory) => ({
          ...subcategory,
          loading: false,
          folders: [],
          categoryId: category.id,
          files: [],
          queue: [{ id: subcategory.id }],
        }))
    );

    return { pages, categories, subcategories };
  }
);

type FCParam = {
  category: string;
  searchSubfolders: boolean;
};
type FCResult = {
  files: File[];
  queue: QueueFolder[];
  unqueuedFolderCount: number;
};
const fetchCategory = createAsyncThunk<FCResult, FCParam, { state: State }>(
  "refreshData",
  async ({ category, searchSubfolders }, thunkApi) => {
    // As a hack, we always search subfolders in subcategories, and never
    // in categories
    const state = thunkApi.getState();
    let previousQueue, existingFiles;
    if (searchSubfolders) {
      const c = state.subcategories.find((c) => c.id === category);
      previousQueue = c.queue;
      existingFiles = c.files;
    } else {
      const c = state.categories.find((c) => c.id === category);
      previousQueue = c.queue;
      existingFiles = c.files;
    }

    const fetchLimit = existingFiles.length === 0 ? 5 : 20;
    let unqueuedFolderCount = 0;
    const newQueue: QueueFolder[] = [];
    const files: File[] = [];

    let folder: QueueFolder;
    if (previousQueue.length > unqueuedFolderCount) {
      folder = previousQueue[unqueuedFolderCount++];
    } else {
      folder = newQueue.splice(0, 1)[0];
    }

    while (folder != null && files.length < fetchLimit) {
      const [contents, folders] = await google.getFiles(folder, fetchLimit);

      files.push(...contents.files);

      if (contents.nextPageToken) {
        newQueue.splice(0, 0, {
          id: folder.id,
          nextPageToken: contents.nextPageToken,
        });
      }

      if (searchSubfolders) {
        newQueue.splice(0, 0, ...folders);
      }

      if (contents.nextPageToken) {
        newQueue.splice(0, 0, {
          ...folder,
          nextPageToken: contents.nextPageToken,
        });
      }

      if (previousQueue.length > unqueuedFolderCount) {
        folder = previousQueue[unqueuedFolderCount++];
      } else {
        folder = newQueue.splice(0, 1)[0];
      }
    }

    return { files, queue: newQueue, unqueuedFolderCount };
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: null,
    pages: <Folder[]>[],
    categories: <Category[]>[],
    subcategories: <Subcategory[]>[],
    activeFile: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setActiveFile: (state, { payload }) => {
      state.activeFile = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStructure.fulfilled, (state, { payload }) => {
      const { categories, pages, subcategories } = payload;
      state.pages = pages;
      state.categories = categories;
      state.subcategories = subcategories;
    });
    builder.addCase(fetchCategory.pending, (state, { meta: { arg } }) => {
      const { category, searchSubfolders } = arg;

      // As a hack, we always search subfolders in subcategories, and never
      // in categories
      if (searchSubfolders) {
        const i = state.subcategories.findIndex((c) => c.id === category);
        state.subcategories[i].loading = true;
      } else {
        const i = state.categories.findIndex((c) => c.id === category);
        state.categories[i].loading = true;
      }
    });
    builder.addCase(
      fetchCategory.fulfilled,
      (state, { payload, meta: { arg } }) => {
        const { category, searchSubfolders } = arg;
        const { files, queue, unqueuedFolderCount } = payload;

        // As a hack, we always search subfolders in subcategories, and never
        // in categories
        if (searchSubfolders) {
          const i = state.subcategories.findIndex((c) => c.id === category);
          state.subcategories[i].files.push(...files);
          state.subcategories[i].queue.splice(0, unqueuedFolderCount, ...queue);
          state.subcategories[i].loading = false;
        } else {
          const i = state.categories.findIndex((c) => c.id === category);
          state.categories[i].files.push(...files);
          state.categories[i].queue.splice(0, unqueuedFolderCount, ...queue);
          state.categories[i].loading = false;
        }
      }
    );

    builder.addCase(fetchCategory.rejected, (state, { meta: { arg } }) => {
      const { category, searchSubfolders } = arg;

      // As a hack, we always search subfolders in subcategories, and never
      // in categories
      if (searchSubfolders) {
        const i = state.subcategories.findIndex((c) => c.id === category);
        state.subcategories[i].loading = false;
      } else {
        const i = state.categories.findIndex((c) => c.id === category);
        state.categories[i].loading = false;
      }
    });
  },
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, store, fetchStructure, fetchCategory, useSelector };
