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
  SiteStructure,
  Subcategory,
} from "../types/types";
import { aFlatMap, aMap } from "../utils/aMap";
import { fireGtmEvent } from "./google-apis";
import * as google from "./google-apis";
import db from "./db";

type State = {
  user?: gapi.auth2.GoogleUser;
  pages: Folder[];
  categories: Category[];
  subcategories: Subcategory[];
  modals: {
    activeFile?: File;
    downloadAllFilesModalVisible: boolean;
    clearCacheModalVisible: boolean;
  };
};

const fetchStructure = createAsyncThunk<SiteStructure, void, {}>(
  "fetchStructure",
  async () => {
    const cachedStructure = await db.getStructure();
    if (cachedStructure) {
      return cachedStructure;
    }

    const pages = await google.getRootFolders();
    const categories: Category[] = await aFlatMap(
      pages,
      async (page) =>
        await aMap(await google.getFolders(page), async (category) => ({
          ...category,
          loading: false,
          pageId: page.id,
          files: [],
        }))
    );
    const subcategories: Subcategory[] = await aFlatMap(
      categories,
      async (category) =>
        await aMap(await google.getFolders(category), (subcategory) => ({
          ...subcategory,
          loading: false,
          categoryId: category.id,
          files: [],
        }))
    );

    const structure = { pages, categories, subcategories };
    await db.setStructure(structure);

    return structure;
  }
);

type FCParam = {
  category: Category | Subcategory;
  isSubcategory: boolean;
};
const fetchCategory = createAsyncThunk<File[], FCParam>(
  "fetchCategory",
  async ({ category }) => {
    const cachedFiles = await db.getFiles(category.id);
    if (cachedFiles) {
      return cachedFiles;
    }

    const files: File[] = [];
    let nextPageToken: string = null;
    do {
      const contents = await google.getFiles(category, nextPageToken);
      files.push(...contents.files);
      nextPageToken = contents.nextPageToken;
    } while (nextPageToken);

    await db.addFiles(files);
    return files;
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: null,
    pages: [],
    categories: [],
    subcategories: [],
    modals: {
      activeFile: null,
      clearCacheModalVisible: false,
      downloadAllFilesModalVisible: false,
    },
  } as State,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setActiveFile: (state, { payload }) => {
      if (payload) {
        fireGtmEvent("Preview File", {
          file_id: payload.id,
          file_name: payload.name,
        });
      }

      state.modals.activeFile = payload;
    },
    showClearCacheModal: (state) => {
      state.modals.clearCacheModalVisible = true;
    },
    hideClearCacheModal: (state) => {
      state.modals.clearCacheModalVisible = false;
    },
    showDownloadAllFilesModal: (state) => {
      state.modals.downloadAllFilesModalVisible = true;
    },
    hideDownloadAllFilesModal: (state) => {
      state.modals.downloadAllFilesModalVisible = false;
    },
    addCategoryFiles: (state, { payload: { id, files } }) => {
      const i = state.categories.findIndex((c) => c.id === id);
      state.categories[i].files.concat(files);
    },
    addSubcategoryFiles: (state, { payload: { id, files } }) => {
      const i = state.subcategories.findIndex((c) => c.id === id);
      state.subcategories[i].files.concat(files);
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
      const { category, isSubcategory } = arg;

      if (isSubcategory) {
        const i = state.subcategories.findIndex((c) => c.id === category.id);
        state.subcategories[i].loading = true;
      } else {
        const i = state.categories.findIndex((c) => c.id === category.id);
        state.categories[i].loading = true;
      }
    });
    builder.addCase(
      fetchCategory.fulfilled,
      (state, { payload: files, meta: { arg } }) => {
        const { category, isSubcategory } = arg;

        if (isSubcategory) {
          const i = state.subcategories.findIndex((c) => c.id === category.id);
          state.subcategories[i].files.push(...files);
          state.subcategories[i].loading = false;
        } else {
          const i = state.categories.findIndex((c) => c.id === category.id);
          state.categories[i].files.push(...files);
          state.categories[i].loading = false;
        }
      }
    );

    builder.addCase(fetchCategory.rejected, (state, { meta: { arg } }) => {
      const { category, isSubcategory } = arg;

      if (isSubcategory) {
        const i = state.subcategories.findIndex((c) => c.id === category.id);
        state.subcategories[i].loading = false;
      } else {
        const i = state.categories.findIndex((c) => c.id === category.id);
        state.categories[i].loading = false;
      }
    });
  },
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, store, fetchStructure, fetchCategory, useSelector };
